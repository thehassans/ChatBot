(function() {
  'use strict';

  const WIDGET_VERSION = '1.0.0';
  const DEFAULT_CONFIG = {
    position: 'right',
    primaryColor: '#5a66f2',
    greeting: 'Hi there! How can we help you today?',
    placeholder: 'Type your message...',
    agentName: 'Support Agent',
  };

  class MagneticNobotWidget {
    constructor(config) {
      this.config = { ...DEFAULT_CONFIG, ...config };
      this.isOpen = false;
      this.messages = [];
      this.conversationId = null;
      this.isTyping = false;
      this.isLoading = false;
      this.sessionId = this.getOrCreateSessionId();
      this.apiBaseUrl = config.apiBaseUrl || window.location.origin;
      
      this.init();
    }

    getOrCreateSessionId() {
      let id = localStorage.getItem('mn_session_id');
      if (!id) {
        id = 'session_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        localStorage.setItem('mn_session_id', id);
      }
      return id;
    }

    init() {
      this.injectStyles();
      this.createWidget();
      this.loadPreviousMessages();
      this.trackPageView();
    }

    injectStyles() {
      const styles = `
        .mn-widget-container * {
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        .mn-widget-button {
          position: fixed;
          bottom: 24px;
          ${this.config.position}: 24px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: ${this.config.primaryColor};
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, box-shadow 0.2s;
          z-index: 999998;
        }
        .mn-widget-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 30px rgba(0,0,0,0.3);
        }
        .mn-widget-button svg {
          width: 28px;
          height: 28px;
          fill: white;
        }
        .mn-widget-window {
          position: fixed;
          bottom: 100px;
          ${this.config.position}: 24px;
          width: 380px;
          height: 550px;
          background: #1e1f23;
          border-radius: 16px;
          box-shadow: 0 10px 50px rgba(0,0,0,0.4);
          display: none;
          flex-direction: column;
          overflow: hidden;
          z-index: 999999;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .mn-widget-window.open {
          display: flex;
          animation: mn-slide-up 0.3s ease;
        }
        @keyframes mn-slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .mn-widget-header {
          padding: 20px;
          background: linear-gradient(135deg, ${this.config.primaryColor}, #a855f7);
          color: white;
        }
        .mn-widget-header h3 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
        }
        .mn-widget-header p {
          margin: 0;
          font-size: 13px;
          opacity: 0.9;
        }
        .mn-widget-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: #121316;
        }
        .mn-widget-message {
          margin-bottom: 12px;
          display: flex;
          flex-direction: column;
        }
        .mn-widget-message.customer {
          align-items: flex-end;
        }
        .mn-widget-message.agent {
          align-items: flex-start;
        }
        .mn-widget-message-bubble {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
        }
        .mn-widget-message.customer .mn-widget-message-bubble {
          background: ${this.config.primaryColor};
          color: white;
          border-bottom-right-radius: 4px;
        }
        .mn-widget-message.agent .mn-widget-message-bubble {
          background: rgba(255,255,255,0.1);
          color: #e5e5e5;
          border-bottom-left-radius: 4px;
        }
        .mn-widget-message-time {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          margin-top: 4px;
        }
        .mn-widget-typing {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: rgba(255,255,255,0.1);
          border-radius: 16px;
          width: fit-content;
        }
        .mn-widget-typing-dot {
          width: 8px;
          height: 8px;
          background: rgba(255,255,255,0.5);
          border-radius: 50%;
          margin-right: 4px;
          animation: mn-typing 1.4s infinite;
        }
        .mn-widget-typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .mn-widget-typing-dot:nth-child(3) { animation-delay: 0.4s; margin-right: 0; }
        @keyframes mn-typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        .mn-widget-input-area {
          padding: 16px;
          background: #1e1f23;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          gap: 12px;
        }
        .mn-widget-input {
          flex: 1;
          padding: 12px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          color: white;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .mn-widget-input:focus {
          border-color: ${this.config.primaryColor};
        }
        .mn-widget-input::placeholder {
          color: rgba(255,255,255,0.4);
        }
        .mn-widget-send {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: ${this.config.primaryColor};
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }
        .mn-widget-send:hover {
          transform: scale(1.1);
        }
        .mn-widget-send svg {
          width: 20px;
          height: 20px;
          fill: white;
        }
        .mn-widget-powered {
          text-align: center;
          padding: 8px;
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          background: #1e1f23;
        }
        .mn-widget-powered a {
          color: rgba(255,255,255,0.5);
          text-decoration: none;
        }
        @media (max-width: 480px) {
          .mn-widget-window {
            width: calc(100% - 32px);
            height: calc(100% - 120px);
            bottom: 90px;
            left: 16px;
            right: 16px;
          }
        }
      `;
      
      const styleSheet = document.createElement('style');
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    createWidget() {
      const container = document.createElement('div');
      container.className = 'mn-widget-container';
      container.innerHTML = `
        <button class="mn-widget-button" id="mn-toggle">
          <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
        </button>
        <div class="mn-widget-window" id="mn-window">
          <div class="mn-widget-header">
            <h3>${this.config.agentName}</h3>
            <p>We typically reply within a few minutes</p>
          </div>
          <div class="mn-widget-messages" id="mn-messages">
            <div class="mn-widget-message agent">
              <div class="mn-widget-message-bubble">${this.config.greeting}</div>
            </div>
          </div>
          <div class="mn-widget-input-area">
            <input type="text" class="mn-widget-input" id="mn-input" placeholder="${this.config.placeholder}" />
            <button class="mn-widget-send" id="mn-send">
              <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>
          <div class="mn-widget-powered">
            Powered by <a href="https://magneticnobot.com" target="_blank">Magnetic Nobot</a>
          </div>
        </div>
      `;
      
      document.body.appendChild(container);
      
      this.elements = {
        toggle: document.getElementById('mn-toggle'),
        window: document.getElementById('mn-window'),
        messages: document.getElementById('mn-messages'),
        input: document.getElementById('mn-input'),
        send: document.getElementById('mn-send'),
      };
      
      this.bindEvents();
    }

    bindEvents() {
      this.elements.toggle.addEventListener('click', () => this.toggle());
      this.elements.send.addEventListener('click', () => this.sendMessage());
      this.elements.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendMessage();
      });
      
    }

    toggle() {
      this.isOpen = !this.isOpen;
      this.elements.window.classList.toggle('open', this.isOpen);
      if (this.isOpen) {
        this.elements.input.focus();
      }
    }

    async loadPreviousMessages() {
      try {
        const response = await fetch(
          `${this.apiBaseUrl}/api/widget/${this.config.workspaceId}/chat?sessionId=${this.sessionId}`
        );
        const data = await response.json();

        if (data.messages && data.messages.length > 0) {
          this.conversationId = data.conversationId;
          // Clear the default greeting if we have previous messages
          this.elements.messages.innerHTML = '';
          data.messages.forEach(msg => {
            this.addMessage(msg.content, msg.sender === 'customer' ? 'customer' : 'agent', new Date(msg.createdAt));
          });
        }
      } catch (error) {
        console.log('No previous messages found');
      }
    }

    async sendMessage() {
      const content = this.elements.input.value.trim();
      if (!content || this.isLoading) return;

      this.addMessage(content, 'customer');
      this.elements.input.value = '';
      this.isLoading = true;
      this.showTyping();

      try {
        const response = await fetch(`${this.apiBaseUrl}/api/widget/${this.config.workspaceId}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: content,
            sessionId: this.sessionId,
            customerInfo: {
              name: 'Website Visitor',
              browser: navigator.userAgent,
              pagesViewed: this.pagesViewed || [],
            },
          }),
        });

        const data = await response.json();
        this.hideTyping();

        if (data.success && data.response) {
          this.conversationId = data.conversationId;
          this.addMessage(data.response, 'agent');
        } else {
          this.addMessage('Sorry, I encountered an error. Please try again.', 'agent');
        }
      } catch (error) {
        console.error('Widget send error:', error);
        this.hideTyping();
        this.addMessage('Sorry, I could not connect. Please try again later.', 'agent');
      } finally {
        this.isLoading = false;
      }
    }

    addMessage(content, sender, timestamp) {
      const messageEl = document.createElement('div');
      messageEl.className = `mn-widget-message ${sender}`;
      messageEl.innerHTML = `
        <div class="mn-widget-message-bubble">${this.escapeHtml(content)}</div>
        <span class="mn-widget-message-time">${this.formatTime(timestamp || new Date())}</span>
      `;
      this.elements.messages.appendChild(messageEl);
      this.scrollToBottom();
    }

    showTyping() {
      if (this.isTyping) return;
      this.isTyping = true;
      
      const typingEl = document.createElement('div');
      typingEl.className = 'mn-widget-message agent';
      typingEl.id = 'mn-typing';
      typingEl.innerHTML = `
        <div class="mn-widget-typing">
          <div class="mn-widget-typing-dot"></div>
          <div class="mn-widget-typing-dot"></div>
          <div class="mn-widget-typing-dot"></div>
        </div>
      `;
      this.elements.messages.appendChild(typingEl);
      this.scrollToBottom();
    }

    hideTyping() {
      this.isTyping = false;
      const typingEl = document.getElementById('mn-typing');
      if (typingEl) typingEl.remove();
    }

    scrollToBottom() {
      this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    }

    trackPageView() {
      this.pagesViewed = this.pagesViewed || [];
      this.pagesViewed.push({
        url: window.location.href,
        title: document.title,
        timestamp: new Date(),
      });
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    formatTime(date) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }

  window.MagneticNobot = {
    init: function(config) {
      if (!config.workspaceId) {
        console.error('MagneticNobot: workspaceId is required');
        return;
      }
      return new MagneticNobotWidget(config);
    }
  };
})();
