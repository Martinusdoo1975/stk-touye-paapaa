import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Copy, Download, RefreshCw, Wand2, Share2 } from 'lucide-react';
import { InputGroup } from './components/InputGroup';
import { generateImageWithGemini } from './services/genAiService';
import { ImageParams, AspectRatio } from './types';

const App: React.FC = () => {
  const [params, setParams] = useState<ImageParams>({
    subject: '',
    style: '',
    lighting: '',
    colors: '',
    details: '',
    aspectRatio: AspectRatio.SQUARE,
  });

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  const handleGenerate = async () => {
    if (!params.subject) {
      setError("Mohon isi 'Subjek Utama' terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImage(null);
    setShowPrompt(false);

    try {
      const result = await generateImageWithGemini(params);
      setGeneratedImage(result);
      setShowPrompt(true);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat membuat gambar.");
    } finally {
      setLoading(false);
    }
  };

  const constructFullPrompt = () => {
    return `Create an image with the following specifications:
1. Main Subject: ${params.subject || 'Not specified'}
2. Visual Style: ${params.style || 'Not specified'}
3. Lighting: ${params.lighting || 'Not specified'}
4. Colors: ${params.colors || 'Not specified'}
5. Details: ${params.details || 'Not specified'}
Ratio: ${params.aspectRatio}`;
  };

  const copyPrompt = () => {
    const text = constructFullPrompt();
    navigator.clipboard.writeText(text);
    alert("Prompt disalin ke clipboard!");
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `imajinasi-ai-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-violet-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-8 md:mb-12 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Imajinasi AI
            </h1>
          </div>
          <p className="text-slate-400 max-w-2xl">
            Buat gambar menakjubkan dengan mengisi detail terstruktur di bawah ini. Kami akan mengubah ide Anda menjadi prompt siap pakai dan memvisualisasikannya secara instan.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-indigo-400" />
                Parameter Gambar
              </h2>
              
              <div className="space-y-5">
                <InputGroup
                  id="subject"
                  label="1. Subjek Utama"
                  value={params.subject}
                  onChange={(v) => setParams(prev => ({ ...prev, subject: v }))}
                  type="textarea"
                  placeholder="Contoh: Seekor kucing astronot duduk di bulan..."
                  helperText="Deskripsikan apa yang ingin Anda lihat di tengah gambar."
                />

                <InputGroup
                  id="style"
                  label="2. Gaya Visual"
                  value={params.style}
                  onChange={(v) => setParams(prev => ({ ...prev, style: v }))}
                  suggestions={["Photorealistic", "Anime", "Cyberpunk", "Oil Painting", "3D Render", "Pixel Art"]}
                  placeholder="Pilih gaya atau ketik sendiri..."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputGroup
                    id="lighting"
                    label="3. Pencahayaan"
                    value={params.lighting}
                    onChange={(v) => setParams(prev => ({ ...prev, lighting: v }))}
                    suggestions={["Cinematic", "Golden Hour", "Neon", "Soft Studio", "Dark & Moody"]}
                  />
                  
                  <InputGroup
                    id="colors"
                    label="4. Warna Dominan"
                    value={params.colors}
                    onChange={(v) => setParams(prev => ({ ...prev, colors: v }))}
                    placeholder="Merah & Emas, Pastel..."
                  />
                </div>

                <InputGroup
                  id="details"
                  label="5. Detail Tambahan"
                  value={params.details}
                  onChange={(v) => setParams(prev => ({ ...prev, details: v }))}
                  type="textarea"
                  placeholder="Partikel debu bercahaya, latar belakang kabur..."
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">6. Format Rasio</label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {Object.entries(AspectRatio).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => setParams(prev => ({ ...prev, aspectRatio: value }))}
                        className={`py-2 px-1 text-xs md:text-sm rounded-lg border transition-all ${
                          params.aspectRatio === value
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Sedang Membuat...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Buat Gambar Sekarang
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-7 space-y-6">
            <div className="h-full min-h-[500px] bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-400" />
                  Hasil Generasi
                </h2>
                {generatedImage && (
                  <div className="flex gap-2">
                     <button 
                      onClick={downloadImage}
                      className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                      title="Download Image"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 rounded-xl bg-slate-950 border border-slate-800/50 overflow-hidden relative flex items-center justify-center group">
                {loading ? (
                  <div className="text-center space-y-4 p-8">
                    <div className="relative w-16 h-16 mx-auto">
                      <div className="absolute inset-0 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-2 border-r-2 border-violet-500 rounded-full animate-spin reverse"></div>
                    </div>
                    <p className="text-indigo-300 animate-pulse font-medium">AI sedang melukis imajinasi Anda...</p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">Ini mungkin memakan waktu beberapa detik tergantung kompleksitas.</p>
                  </div>
                ) : error ? (
                  <div className="text-center p-8 max-w-md">
                    <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <RefreshCw className="w-6 h-6" />
                    </div>
                    <p className="text-red-400 font-medium mb-2">Gagal Membuat Gambar</p>
                    <p className="text-sm text-slate-500">{error}</p>
                  </div>
                ) : generatedImage ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-black/20">
                     <img 
                      src={generatedImage} 
                      alt={params.subject}
                      className="max-w-full max-h-[70vh] object-contain shadow-2xl rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="text-center p-8 text-slate-600">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Isi formulir di sebelah kiri dan tekan "Buat Gambar" untuk melihat keajaiban.</p>
                  </div>
                )}
              </div>

              {/* Ready-to-use Prompt Box */}
              {showPrompt && !loading && (
                <div className="mt-6 animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Prompt Siap Pakai (English)</span>
                    <button 
                      onClick={copyPrompt}
                      className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      Salin Prompt
                    </button>
                  </div>
                  <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 font-mono text-xs text-slate-400 leading-relaxed overflow-x-auto">
                     {constructFullPrompt()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
