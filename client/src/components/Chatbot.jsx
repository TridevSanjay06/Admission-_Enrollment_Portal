import { useCallback, useEffect, useRef, useState } from 'react';
import { sendChatbotMessage } from '../services/api.js';

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatTime(d = new Date()) {
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const QUICK = [
  { label: '📅 Admission Dates', q: 'admission dates' },
  { label: '💰 Fee Structure', q: 'fee structure' },
  { label: '📍 Location', q: 'location' },
  { label: '📞 Contact Info', q: 'contact' }
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  const scrollBottom = useCallback(() => {
    const el = document.getElementById('chatbot-messages');
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollBottom();
  }, [messages, typing, open, scrollBottom]);

  useEffect(() => {
    function onDocClick(e) {
      if (!open) return;
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [open]);

  const pushBot = useCallback((text) => {
    setMessages((m) => [...m, { role: 'bot', text, time: formatTime() }]);
  }, []);

  const pushUser = useCallback((text) => {
    setMessages((m) => [...m, { role: 'user', text, time: formatTime() }]);
  }, []);

  function openChat() {
    setOpen(true);
    setMessages((m) => {
      if (m.length > 0) return m;
      return [
        {
          role: 'bot',
          text: "Hello! 👋 I'm here to help you with information about Alpha Model's International School. You can ask me about admissions, fees, location, or use the quick buttons below!",
          time: formatTime()
        }
      ];
    });
    queueMicrotask(() => inputRef.current?.focus());
  }

  async function ask(question) {
    if (!question.trim() || typing) return;
    pushUser(question.trim());
    setTyping(true);
    try {
      const data = await sendChatbotMessage(question.trim());
      if (data.ok) {
        pushBot(data.answer);
      } else {
        pushBot("I'm sorry, I'm having trouble processing your request right now. Please try again or contact us directly at admissions@alphamodels.in");
      }
    } catch {
      pushBot("I'm sorry, I'm having trouble connecting right now. Please try again or contact us directly at admissions@alphamodels.in");
    } finally {
      setTyping(false);
    }
  }

  return (
    <div
      id="ams-chatbot"
      className={`ams-chatbot${open ? ' open' : ''}`}
      ref={rootRef}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="chatbot-toggle"
        role="button"
        tabIndex={0}
        onClick={() => (open ? setOpen(false) : openChat())}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            open ? setOpen(false) : openChat();
          }
        }}
      >
        <div className="chatbot-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"
              fill="currentColor"
            />
            <path d="M7 9H17V11H7V9ZM7 12H14V14H7V12Z" fill="currentColor" />
          </svg>
        </div>
        <span className="chatbot-label">Need Help?</span>
      </div>

      <div className="chatbot-window" id="chatbot-window">
        <div className="chatbot-header">
          <div className="chatbot-header-content">
            <div className="chatbot-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="chatbot-title">
              <h3>AMS Assistant</h3>
              <p>Ask me about admissions, fees, location, and more!</p>
            </div>
          </div>
          <button type="button" className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div className="chatbot-messages" id="chatbot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chatbot-message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}>
              <div className="message-content">
                {msg.role === 'user' ? (
                  <p>{msg.text}</p>
                ) : (
                  <p dangerouslySetInnerHTML={{ __html: escapeHtml(msg.text).replace(/\n/g, '<br/>') }} />
                )}
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          ))}
          {typing && (
            <div className="chatbot-message bot-message typing" id="typing-indicator">
              <div className="message-content">
                <div className="typing-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="chatbot-input-area">
          <div className="chatbot-input-container">
            <input
              ref={inputRef}
              type="text"
              className="ams-chatbot-input"
              placeholder="Type your question here..."
              maxLength={500}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  const q = input;
                  setInput('');
                  ask(q);
                }
              }}
            />
            <button
              type="button"
              className="chatbot-send"
              disabled={typing}
              onClick={() => {
                const q = input;
                setInput('');
                ask(q);
              }}
              aria-label="Send"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor" />
              </svg>
            </button>
          </div>
          <div className="chatbot-quick-actions">
            {QUICK.map((b) => (
              <button key={b.q} type="button" className="quick-action" onClick={() => ask(b.q)}>
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
