import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Phone, MessageSquare, Mail, MapPin, Globe, Sparkles, AlertCircle, Copy, CheckSquare } from 'lucide-react';

interface QuoteBrief {
  service: string;
  notes: string;
  timeline: string;
  urgent: boolean;
}

export default function ContactHub() {
  const [copied, setCopied] = useState<boolean>(false);
  const [brief, setBrief] = useState<QuoteBrief>({
    service: 'Custom Packaging Label',
    notes: '',
    timeline: 'Standard (4-6 Days)',
    urgent: false
  });
  
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);



  const fallbackCopy = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
  };

  const handleCopyContact = async () => {
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText('9370384781');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        fallbackCopy('9370384781');
      }
    } catch (err) {
      console.warn('Clipboard write failed, using fallback:', err);
      fallbackCopy('9370384781');
    }
  };

  // WhatsApp prefilled message string
  const getWhatsAppLink = () => {
    const text = encodeURIComponent(
      `Hi Affan, I saw your graphic designer portfolio and formulated a design brief.\n\n` +
      `*Service Required:* ${brief.service}\n` +
      `*Notes/Overview:* ${brief.notes || 'N/A'}\n` +
      `*Timeline:* ${brief.timeline}\n` +
      `*Urgent Priority:* ${brief.urgent ? 'Yes ✦' : 'No'}\n\n` +
      `Let's connect and discuss this further!`
    );
    return `https://wa.me/919637094095?text=${text}`;
  };

  // Email prefilled mailto details
  const getEmailLink = () => {
    const subject = encodeURIComponent(`Design Brief Inquiry for Affan - ${brief.service}`);
    const body = encodeURIComponent(
      `Hello Momin Affan,\n\n` +
      `I would like to discuss a customized design service with you:\n\n` +
      `- Design Service: ${brief.service}\n` +
      `- Target Timeline: ${brief.timeline}\n` +
      `- Brief Description: ${brief.notes || 'N/A'}\n\n` +
      `Kind Regards`
    );
    return `mailto:iftekharaffan0@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="py-12" id="contact-section">
      <div className="mb-8">
        <span className="text-xs font-mono uppercase text-[#FF3E00] tracking-widest font-bold block mb-1">Let's Work Together</span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">
          Initiate Design Brief
        </h2>
        
        {/* Calibrated Lock-On Line */}
        <div className="relative w-full pt-4 pb-1 overflow-hidden pointer-events-none select-none">
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-[1px] w-full bg-gradient-to-r from-[#FF3E00] via-card-border to-transparent origin-left border-t border-dashed border-[#FF3E00]/30"
          />
          <div className="absolute right-0 top-1.5 flex items-center space-x-1.5 font-mono text-[8px] text-[#A3A3A3] opacity-80">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.7 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              SEC_CNT_07
            </motion.span>
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-1.5 h-1.5 bg-[#FF3E00]"
            />
          </div>
        </div>

        <p className="text-sm text-[#737373] mt-2.5 max-w-xl">
          Instantly formulate a clear creative checklist to calculate rates and trigger a prepared Whatsapp or Email brief in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Hand: Custom Quote Estimator */}
        <div className="lg:col-span-7 bg-[#111111] border border-[#222] p-6 md:p-8 rounded-lg space-y-6">
          <span className="text-[10px] font-mono text-[#FF3E00] uppercase tracking-wider block border-b border-[#222] pb-1">
            Creative Brief Configurator
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-mono text-[#A3A3A3] block mb-1">
                Select Design Category:
              </label>
              <select
                value={brief.service}
                onChange={(e) => setBrief({ ...brief, service: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#2d2d2d] rounded px-3 py-2 text-xs text-white uppercase focus:border-[#FF3E00] focus:outline-none font-mono"
              >
                <option value="Custom Packaging Label">Custom Packaging Label</option>
                <option value="Outdoor Front Flex Banner">Outdoor Front Flex Banner</option>
                <option value="Visual Brand Logo & Guidelines">Visual Brand Logo & Guidelines</option>
                <option value="Engagement Social Media Set (10 Posts)">Engagement Social Media Set (10 Posts)</option>
                <option value="Corporate Catalogue & Brochure Layout">Corporate Catalogue & Brochure Layout</option>
                <option value="Custom Trophy / Acrylic Medal Vector">Custom Trophy / Acrylic Medal Vector</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-[#A3A3A3] block mb-1">
                Project Schedule Range:
              </label>
              <select
                value={brief.timeline}
                onChange={(e) => setBrief({ ...brief, timeline: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#2d2d2d] rounded px-3 py-2 text-xs text-white uppercase focus:border-[#FF3E00] focus:outline-none font-mono"
              >
                <option value="Express (24-48 Hours)">Express (24-48 Hours)</option>
                <option value="Standard (4-6 Days)">Standard (4-6 Days)</option>
                <option value="Relaxed (1-2 Weeks)">Relaxed (1-2 Weeks)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-mono text-[#A3A3A3] block mb-1">
              Creative Brief Summaries & Dimensions (Optional):
            </label>
            <textarea
              value={brief.notes}
              onChange={(e) => setBrief({ ...brief, notes: e.target.value })}
              placeholder="e.g. Needs to be printed on a 10ft x 4ft flex board with CMYK colors. Core brand flavor highlights are herbal extracts and nature freshness..."
              rows={3}
              maxLength={250}
              className="w-full bg-[#1A1A1A] border border-[#2d2d2d] rounded px-3 py-2 text-xs text-white uppercase focus:border-[#FF3E00] focus:outline-none placeholder-gray-600 font-mono resize-none"
            />
          </div>

          {/* Urgent Priority Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="urgent"
              checked={brief.urgent}
              onChange={(e) => setBrief({ ...brief, urgent: e.target.checked })}
              className="w-4 h-4 accent-[#FF3E00] bg-black border-[#2d2d2d] rounded cursor-pointer"
            />
            <label htmlFor="urgent" className="text-xs font-mono uppercase text-white cursor-pointer select-none flex items-center gap-1">
              Mark as High Critical Priority (Express Queue)
            </label>
          </div>

          {/* Action Panel */}
          <div className="bg-[#1C1C1C] border border-[#222] p-6 rounded relative overflow-hidden">
            <div className="absolute right-3 top-3 select-none pointer-events-none p-1 rounded-full bg-[#FF3E00]/10 text-[#FF3E00]">
              <Sparkles className="w-4 h-4" />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="max-w-md text-left">
                <span className="text-[10px] font-mono text-white/50 uppercase block">Ready to Connect?</span>
                <p className="text-xs text-[#A3A3A3] mt-1 leading-relaxed">
                  Send your customized brief details directly to Affan. He will review your specifications and get in touch with you to discuss the project schedule and rates.
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-auto">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#00FF66] hover:bg-[#00E055] text-black text-xs font-black px-4 py-2.5 rounded text-center font-mono uppercase flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  Send brief to WhatsApp
                </a>
                
                <a
                  href={getEmailLink()}
                  className="bg-white hover:bg-gray-200 text-black text-xs font-black px-4 py-2.5 rounded text-center font-mono uppercase flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Send brief via Email
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Hand: Direct Contact Details & Locators */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0D0D0D] border border-[#222] p-6 md:p-8 rounded-lg flex flex-col justify-between h-full space-y-6">
            
            {/* Direct Information List */}
            <div className="space-y-6">
              <span className="text-[10px] font-mono text-[#D4D4D4] uppercase tracking-wider block border-b border-[#222] pb-1">
                Direct Contact Particulars
              </span>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#1A1A1A] border border-[#222] rounded text-[#FF3E00]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#737373] uppercase">Call / Voice Line</span>
                    <p className="text-sm font-bold text-white uppercase flex items-center gap-2">
                      +91 93703 84781
                      <button 
                        onClick={handleCopyContact}
                        className="text-[10px] font-mono text-[#FF3E00] hover:underline flex items-center gap-0.5 ml-2"
                      >
                        <Copy className="w-3 h-3" />
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#1A1A1A] border border-[#222] rounded text-[#FF3E00]">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#737373] uppercase">WhatsApp Chat</span>
                    <a href="https://wa.me/919637094095" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-white hover:text-[#FF3E00] transition-colors uppercase block">
                      +91 96370 94095
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#1A1A1A] border border-[#222] rounded text-[#FF3E00]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#737373] uppercase">Official Email</span>
                    <a href="mailto:iftekharaffan0@gmail.com" className="text-sm font-bold text-white hover:text-[#FF3E00] transition-colors block select-all">
                      iftekharaffan0@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#1A1A1A] border border-[#222] rounded text-[#FF3E00]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#737373] uppercase">Primary Address Studio</span>
                    <p className="text-sm font-bold text-white uppercase leading-tight">
                      Bhiwandi, Dist. Thane - 421302<br />
                      <span className="text-xs text-stone-500 font-normal">Maharashtra, India</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Languages Spoken Grid */}
              <div className="pt-2">
                <span className="text-[10px] font-mono text-[#737373] uppercase tracking-wider block mb-2">
                  Known Languages
                </span>
                <div className="flex flex-wrap gap-2">
                  {['English', 'Hindi', 'Marathi', 'Urdu'].map((lang) => (
                    <span
                      key={lang}
                      className="text-[10px] font-mono px-3 py-1 bg-[#151515] hover:bg-[#FF3E00]/10 hover:border-[#FF3E00]/30 transition-all border border-[#222] text-[#F3F3F3] rounded"
                    >
                      🗣️ {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulated Vector Target Grid Radar (A beautiful creative element!) */}
            <div className="border border-[#222] p-4 bg-black/50 rounded space-y-2 relative overflow-hidden">
              <span className="text-[9px] font-mono text-[#737373] uppercase block">Radar Pin - Regional Ingress:</span>
              <div className="h-16 flex items-center justify-center border border-dashed border-gray-800 rounded relative">
                {/* Concentric rings */}
                <div className="absolute w-12 h-12 rounded-full border border-gray-800 border-dashed animate-pulse"></div>
                <div className="absolute w-24 h-8 rounded-full border border-gray-800/50"></div>
                
                <span className="text-[10px] font-mono text-white tracking-widest z-15 text-center flex items-center gap-1.5 font-bold uppercase">
                  <MapPin className="w-3 h-3 text-[#FF3E00] animate-bounce" />
                  BHIWANDI • DIST THANE
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
