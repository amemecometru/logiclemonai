import './App.css';

function App() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">LogiclemonAI</h1>
          <p className="hero-subtitle">We build AI solutions that grip results and don't let go. MCP servers, intelligent automations, and AI assistants built for your business.</p>
          <div className="hero-actions">
            <button className="btn-primary">See Our Work</button>
            <button className="btn-secondary">Get Started</button>
          </div>
        </div>
        <div className="hero-bg">
          <div className="glow"></div>
          <div className="lemon-mark"></div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">Specialized AI solutions for businesses ready to scale</p>
        <div className="services-grid">
          <div className="service-card">
            <h3>AI Development</h3>
            <p>Custom AI models, fine-tuning, and integration. We build AI that actually understands your business.</p>
            <ul className="service-list">
              <li>Custom model development</li>
              <li>Model fine-tuning & optimization</li>
              <li>AI system integration</li>
              <li>Performance monitoring</li>
            </ul>
          </div>
          
          <div className="service-card">
            <h3>MCP Servers & Automations</h3>
            <p>Model Context Protocol servers connecting AI to your data, tools, and workflows. Lead generation, scraping, and business automations.</p>
            <ul className="service-list">
              <li>Custom MCP server development</li>
              <li>Google tools integration</li>
              <li>Lead generation pipelines</li>
              <li>Workflow automation</li>
            </ul>
          </div>
          
          <div className="service-card">
            <h3>AI Assistants & Chatbots</h3>
            <p>Intelligent chatbots and AI assistants that handle customer service, sales, and operations around the clock.</p>
            <ul className="service-list">
              <li>Customer support bots</li>
              <li>Sales qualification assistants</li>
              <li>Internal productivity tools</li>
              <li>Multi-channel deployment</li>
            </ul>
          </div>

          <div className="service-card">
            <h3>AI Consulting</h3>
            <p>Strategy, implementation, and audit. We help you navigate the AI landscape and make the right decisions.</p>
            <ul className="service-list">
              <li>AI strategy & roadmapping</li>
              <li>Technology stack evaluation</li>
              <li>Process optimization</li>
              <li>Team training & enablement</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Why Choose LogiclemonAI?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Guaranteed Results</h3>
            <p>We don't just build - we build to perform. Every solution includes performance metrics and optimization.</p>
          </div>
          <div className="feature-card">
            <h3>Future-Proof Tech</h3>
            <p>Built on cutting-edge stacks: Cloudflare Workers, React, TypeScript, and Model Context Protocol.</p>
          </div>
          <div className="feature-card">
            <h3>Transparent Process</h3>
            <p>From discovery to deployment and beyond - you're involved every step with clear timelines and deliverables.</p>
          </div>
          <div className="feature-card">
            <h3>Ongoing Support</h3>
            <p>Our relationship doesn't end at launch. We offer maintenance, updates, and optimization retainers.</p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process">
        <h2 className="section-title">Our Process</h2>
        <div className="process-steps">
          <div className="process-step">
            <div className="step-number">01</div>
            <h3>Discovery & Strategy</h3>
            <p>We dive deep into your business goals, challenges, and opportunities to craft the perfect AI solution blueprint.</p>
          </div>
          <div className="process-step">
            <div className="step-number">02</div>
            <h3>Design & Architecture</h3>
            <p>We design the user experience and technical architecture, getting your approval before writing a line of code.</p>
          </div>
          <div className="process-step">
            <div className="step-number">03</div>
            <h3>Development & Testing</h3>
            <p>Agile development with regular demos, rigorous testing, and quality assurance throughout the build.</p>
          </div>
          <div className="process-step">
            <div className="step-number">04</div>
            <h3>Deployment & Training</h3>
            <p>We deploy to production, train your team, and provide documentation for smooth operation.</p>
          </div>
          <div className="process-step">
            <div className="step-number">05</div>
            <h3>Optimization & Scale</h3>
            <p>Post-launch monitoring, performance optimization, and scaling strategies as you grow.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing">
        <h2 className="section-title">Solutions for Every Stage</h2>
        <p className="section-subtitle">Choose the engagement model that fits your needs and budget</p>
        <div className="pricing-cards">
          <div className="pricing-card">
            <h3>Starter AI</h3>
            <p className="price">$1,500</p>
            <p className="price-period">starting at</p>
            <ul className="pricing-features">
              <li>AI chatbot or automation</li>
              <li>Basic web interface</li>
              <li>Deployment & training</li>
              <li>30 days email support</li>
            </ul>
            <button className="btn-pricing">Get Started</button>
          </div>
          
          <div className="pricing-card featured">
            <h3>Growth AI</h3>
            <p className="price">$4,500</p>
            <p className="price-period">starting at</p>
            <ul className="pricing-features">
              <li>Advanced AI workflow automation</li>
              <li>Custom dashboard & analytics</li>
              <li>MCP server integration</li>
              <li>Deployment & team training</li>
              <li>60 days priority support</li>
            </ul>
            <button className="btn-pricing">Most Popular</button>
          </div>
          
          <div className="pricing-card">
            <h3>Enterprise AI</h3>
            <p className="price">Custom</p>
            <p className="price-period">quote</p>
            <ul className="pricing-features">
              <li>Full AI ecosystem</li>
              <li>Custom MCP server suite</li>
              <li>Dedicated support engineer</li>
              <li>SLAs & performance guarantees</li>
              <li>Quarterly business reviews</li>
            </ul>
            <button className="btn-pricing">Get Quote</button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <h2 className="section-title">Get in Touch</h2>
        <p className="section-subtitle">Ready to start your AI project? Let's talk.</p>
        <form 
          className="contact-form"
          action="https://formspree.io/f/YOUR_FORM_ID"
          method="POST"
        >
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required placeholder="Your name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required placeholder="you@company.com" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input type="text" id="company" name="company" placeholder="Your company (optional)" />
          </div>
          <div className="form-group">
            <label htmlFor="service">Service Interest</label>
            <select id="service" name="service">
              <option value="">Select a service...</option>
              <option value="ai-development">AI Development</option>
              <option value="mcp-servers">MCP Servers & Automations</option>
              <option value="chatbots">AI Assistants & Chatbots</option>
              <option value="consulting">AI Consulting</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} required placeholder="Tell us about your project..."></textarea>
          </div>
          <button type="submit" className="btn-primary btn-submit">Send Message</button>
        </form>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>LogiclemonAI</h3>
            <p>AI Agency for Modern Business</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Services</h4>
              <a href="#">AI Development</a>
              <a href="#">MCP Servers</a>
              <a href="#">AI Assistants</a>
              <a href="#">Consulting</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Security</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 LogiclemonAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
