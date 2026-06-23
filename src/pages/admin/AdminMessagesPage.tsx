import { useState } from 'react'
import { getContactMessages, markContactMessageRead } from '../../services/contactService'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState(() => getContactMessages())

  const refresh = () => setMessages(getContactMessages())

  const handleMarkRead = (id: string) => {
    markContactMessageRead(id)
    refresh()
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="font-serif text-2xl text-charcoal">Contact Messages</h1>
      <p className="mt-1 text-sm text-charcoal/60">{messages.length} messages received</p>

      {messages.length === 0 ? (
        <div className="mt-12 border border-dashed border-accent py-16 text-center">
          <p className="text-sm text-charcoal/50">No messages yet. Contact form submissions appear here.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`border p-5 ${msg.read ? 'border-accent bg-cream' : 'border-maroon/30 bg-maroon/5'}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-charcoal">
                    {msg.firstName} {msg.lastName}
                  </p>
                  <p className="text-xs text-charcoal/50">
                    {msg.email}
                    {msg.phone && ` · ${msg.phone}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-charcoal/40">
                    {new Date(msg.createdAt).toLocaleString('en-IN')}
                  </span>
                  {!msg.read && (
                    <button
                      onClick={() => handleMarkRead(msg.id)}
                      className="text-[10px] font-medium tracking-[0.1em] text-maroon uppercase hover:text-maroon-light"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
