import { spawn } from 'child_process';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';

export class MCPService {
  private serverProcess: any = null;
  private resolver: ((value: unknown) => void) | null = null;
  private rejector: ((reason?: any) => void) | null = null;
  private requestId: number = 1;
  private pendingRequests: Map<number, { resolve: (value: unknown) => void; reject: (reason?: any) => void }> = new Map();

  async initialize(): Promise<boolean> {
    try {
      // Spawn the MCP server as a child process
      this.serverProcess = spawn('bun', ['mcp.server/src/index.js'], {
        cwd: process.cwd(),
        env: {
          ...process.env,
          // Ensure the server uses the correct working directory
          PWD: process.cwd()
        }
      });

      // Set up stdout listener for JSON-RPC responses
      this.serverProcess.stdout.on('data', (data: Buffer) => {
        try {
          const response = JSON.parse(data.toString().trim());
          this.handleResponse(response);
        } catch (parseError) {
          // Handle partial or invalid JSON
          console.warn('MCP Server partial output:', data.toString());
        }
      });

      // Set up stderr listener for logging
      this.serverProcess.stderr.on('data', (data: Buffer) => {
        console.log('MCP Server stderr:', data.toString().trim());
      });

      // Handle process exit
      this.serverProcess.on('close', (code: number) => {
        console.log(`MCP Server process exited with code ${code}`);
        // Reject all pending requests
        this.pendingRequests.forEach(({ reject }) => reject(new Error(`MCP Server exited with code ${code}`)));
        this.pendingRequests.clear();
      });

      // Handle process error
      this.serverProcess.on('error', (err: Error) => {
        console.error('MCP Server process error:', err);
        this.pendingRequests.forEach(({ reject }) => reject(err));
        this.pendingRequests.clear();
      });

      // Wait a moment for server to initialize
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("MCP Service initialized with stdio connection");
      return true;
    } catch (error) {
      console.error("Failed to initialize MCP Service:", error);
      return false;
    }
  }

  private handleResponse(response: any): void {
    if (!response || !('id' in response)) {
      console.warn('Received invalid MCP response:', response);
      return;
    }

    const request = this.pendingRequests.get(response.id);
    if (!request) {
      console.warn('Received response for unknown request ID:', response.id);
      return;
    }

    // Remove from pending requests
    this.pendingRequests.delete(response.id);

    if ('error' in response) {
      request.reject(new Error(response.error.message || 'Unknown MCP error'));
    } else {
      request.resolve(response.result);
    }
  }

  private sendRequest(method: string, params: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestId = this.requestId++;
      
      const request = {
        jsonrpc: "2.0",
        id: requestId,
        method,
        params
      };

      this.pendingRequests.set(requestId, { resolve, reject });
      
      const requestStr = JSON.stringify(request) + '\n';
      this.serverProcess.stdin.write(requestStr);
    });
  }

  async deepResearch(url: string, options: {
    extractor?: 'llm-extraction' | 'css-selector';
    prompt?: string;
    paymentSessionId: string;
    saveToDrive?: boolean;
  }): Promise<{ 
    content: string; 
    driveLink?: string; 
    error?: string 
  }> {
    try {
      // Validate payment session ID
      if (!options.paymentSessionId) {
        throw new Error("Payment session ID required");
      }

      // Call the deep_research tool on the MCP server
      const result = await this.sendRequest('tools/call', {
        name: 'deep_research',
        arguments: {
          url,
          extractor: options.extractor || 'llm-extraction',
          prompt: options.prompt,
          payment_session_id: options.paymentSessionId,
          save_to_drive: options.saveToDrive !== false ? true : false
        }
      });

      // Parse the MCP response
      if (result.isError) {
        return {
          content: '',
          error: result.content[0]?.text || 'Unknown error from deep_research tool'
        };
      }

      const textContent = result.content[0]?.text || '';
      
      // Extract Google Drive link if present in the response
      let driveLink: string | undefined;
      const driveMatch = textContent.match(/https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/);
      if (driveMatch) {
        driveLink = driveMatch[0];
      }

      return {
        content: textContent,
        driveLink,
        error: undefined
      };
    } catch (error) {
      return {
        content: '',
        error: error instanceof Error ? error.message : 'Unknown error in MCP service'
      };
    }
  }

  async shutdown(): Promise<void> {
    if (this.serverProcess) {
      this.serverProcess.stdin.end();
      this.serverProcess.kill();
      this.serverProcess = null;
    }
    
    // Reject any pending requests
    this.pendingRequests.forEach(({ reject }) => reject(new Error('MCP Service shutting down')));
    this.pendingRequests.clear();
  }
}

// Singleton instance
export const mcpService = new MCPService();
