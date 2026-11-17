import React, { useState } from 'react';
import { Copy, CheckCircle, Save, MessageSquare, Plus, Trash2 } from 'lucide-react';

export default function MessageTemplates({
  templates = [],
  onSaveTemplates
}) {
  const [templateList, setTemplateList] = useState(templates);
  const [copiedId, setCopiedId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleCopy = async (tpl) => {
    try {
      await navigator.clipboard.writeText(tpl.body);
      setCopiedId(tpl.id);
      setTimeout(() => setCopiedId(null), 3000);
    } catch (e) {
      const textarea = document.createElement('textarea');
      textarea.value = tpl.body;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedId(tpl.id);
      setTimeout(() => setCopiedId(null), 3000);
    }
  };

  const handleBodyChange = (id, newBody) => {
    setTemplateList(prev => prev.map(t => (t.id === id ? { ...t, body: newBody } : t)));
  };

  const handleAddTemplate = () => {
    const newId = `tpl-${Date.now()}`;
    setTemplateList(prev => [
      ...prev,
      {
        id: newId,
        name: 'New Custom Template',
        body: 'Hello {customer_name}! This is Sojib\'s Mart regarding your heater order #{order_id}.'
      }
    ]);
  };

  const handleDeleteTemplate = (id) => {
    setTemplateList(prev => prev.filter(t => t.id !== id));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSuccessMsg('');
    try {
      await onSaveTemplates(templateList);
      setSuccessMsg('All message templates saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('Error saving templates: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            Saved WhatsApp & Messenger Replies
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Quick-copy canned responses for customer updates. Variables like <code>&#123;customer_name&#125;</code> and <code>&#123;model&#125;</code> can be filled when sending.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleAddTemplate}
            className="btn-secondary"
            style={{ padding: '0.65rem 1rem', fontSize: '0.88rem' }}
          >
            <Plus size={16} />
            <span>Add Template</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="btn-primary hover-lift"
            style={{ padding: '0.65rem 1.4rem', fontSize: '0.92rem' }}
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save All Templates'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div style={{
          backgroundColor: '#f0fdf4',
          color: '#15803d',
          border: '1.5px solid #86efac',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 700
        }}>
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Templates List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {templateList.map((tpl) => (
          <div
            key={tpl.id}
            style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={17} color="var(--color-primary)" />
                <input
                  type="text"
                  value={tpl.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setTemplateList(prev => prev.map(t => (t.id === tpl.id ? { ...t, name: newName } : t)));
                  }}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    border: '1px solid transparent',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    color: 'var(--color-text-main)'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                  onBlur={(e) => (e.target.style.borderColor = 'transparent')}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {/* One-Click Copy Button */}
                <button
                  type="button"
                  onClick={() => handleCopy(tpl)}
                  className="btn-primary hover-lift"
                  style={{
                    padding: '0.45rem 0.95rem',
                    fontSize: '0.82rem',
                    backgroundColor: copiedId === tpl.id ? '#15803d' : 'var(--color-primary)',
                    borderColor: copiedId === tpl.id ? '#15803d' : 'var(--color-primary)'
                  }}
                >
                  {copiedId === tpl.id ? (
                    <>
                      <CheckCircle size={14} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Template</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDeleteTemplate(tpl.id)}
                  style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}
                  title="Delete template"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <textarea
              rows="3"
              className="form-textarea"
              style={{ fontSize: '0.9rem', lineHeight: 1.5 }}
              value={tpl.body}
              onChange={(e) => handleBodyChange(tpl.id, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
