import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Paperclip, Smile, Image as ImageIcon, Send } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
// Full emoji picker

interface EmojiData {
  native?: string;
  unified?: string;
}

export interface MobileChatInputProps {
  value: string;
  onChange: (_next: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onFilesSelected?: (_files: FileList) => void;
  onImagesSelected?: (_files: FileList) => void;
}



const MobileChatInput: React.FC<MobileChatInputProps> = ({
  value,
  onChange,
  onSend,
  placeholder = 'Type a message...',
  disabled = false,
  className = '',
  onFilesSelected,
  onImagesSelected,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleAttachClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleImageClick = () => {
    if (imageInputRef.current) imageInputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected?.(e.target.files);
      // Reset so selecting the same file again triggers change
      e.currentTarget.value = '';
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImagesSelected?.(e.target.files);
      e.currentTarget.value = '';
    }
  };

  const handleEmojiInsert = (emoji: string) => {
    onChange(`${value}${value ? ' ' : ''}${emoji}`);
    setShowEmojiPicker(false);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) onSend();
    }
  };

  const content = (
    <div 
      className={`flex gap-2 p-3 pb-4 bg-black border-t border-white/10 ${className}`} 
      style={{ 
        WebkitUserSelect: 'text', 
        userSelect: 'text',
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        zIndex: 100000,
        width: '100%',
        minHeight: '64px',
        pointerEvents: 'auto'
      }}
    >      
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          type="button"
          onClick={handleAttachClick}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          title="Attach file"
          aria-label="Attach file"
        >
          <Paperclip className="w-4 h-4 text-gray-300" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={() => setShowEmojiPicker((s) => !s)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors relative"
          title="Add emoji"
          aria-label="Add emoji"
        >
          <Smile className="w-4 h-4 text-gray-300" />
        </button>
        {showEmojiPicker && typeof document !== 'undefined' && createPortal(
          <div
            style={{
              position: 'fixed',
              left: '50%',
              transform: 'translateX(-50%)',
              bottom: 'calc(env(safe-area-inset-bottom, 0) + 72px)',
              zIndex: 100001,
              width: 'min(420px, 96vw)'
            }}
          >
            <Picker
              data={data}
              onEmojiSelect={(emoji: EmojiData) => handleEmojiInsert(emoji.native || '')}
              theme="dark"
              previewPosition="none"
            />
          </div>,
          document.body
        )}

        <button
          type="button"
          onClick={handleImageClick}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          title="Add image"
          aria-label="Add image"
        >
          <ImageIcon className="w-4 h-4 text-gray-300" />
        </button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      <div className="flex-1 relative mx-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-black rounded-xl px-4 py-3 text-base text-white placeholder-gray-400 focus:outline-none border border-white/10 focus:border-purple-400/50"
          aria-label={placeholder}
          disabled={disabled}
          style={{ minHeight: '44px', fontSize: '16px' }}
        />
      </div>

      <button
        type="button"
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className="px-3.5 py-3 bg-purple-500 rounded-xl text-white text-base font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 send-button flex-shrink-0"
        aria-label="Send message"
        style={{ minHeight: '44px' }}
      >
        <Send className="w-3 h-3" />
        Send
      </button>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
};

export default MobileChatInput;
