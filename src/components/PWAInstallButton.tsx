import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    
    if (isStandalone || isInWebAppiOS) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show install prompt after a delay for better UX
    const timer = setTimeout(() => {
      if (!isInstalled && (deferredPrompt || isMobile())) {
        setShowInstallPrompt(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, [deferredPrompt, isInstalled]);

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Chrome/Edge install
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
      }
    } else if (isIOS()) {
      // iOS install instructions
      setShowInstallPrompt(true);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed this session
  if (isInstalled || sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  // iOS Install Instructions Modal
  if (isIOS() && showInstallPrompt && !deferredPrompt) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
        <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 relative">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="h-8 w-8 text-forest-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Install HandyNaija App
            </h3>
            
            <p className="text-gray-600 text-sm mb-6">
              Add HandyNaija to your home screen for quick access and a better experience.
            </p>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-xs font-bold">1</span>
                </div>
                <p className="text-sm text-gray-700">
                  Tap the <strong>Share</strong> button in Safari
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-xs font-bold">2</span>
                </div>
                <p className="text-sm text-gray-700">
                  Select <strong>"Add to Home Screen"</strong>
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-xs font-bold">3</span>
                </div>
                <p className="text-sm text-gray-700">
                  Tap <strong>"Add"</strong> to install
                </p>
              </div>
            </div>
            
            <button
              onClick={handleDismiss}
              className="w-full mt-6 bg-forest-600 text-white py-3 rounded-lg font-medium hover:bg-forest-700 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Install Button/Banner
  if (showInstallPrompt && isMobile()) {
    return (
      <>
        {/* Floating Install Button */}
        <button
          onClick={handleInstallClick}
          className="fixed bottom-4 right-4 bg-forest-600 text-white p-3 rounded-full shadow-lg hover:bg-forest-700 transition-colors z-40 flex items-center space-x-2"
        >
          <Download className="h-5 w-5" />
          <span className="hidden sm:inline text-sm font-medium">Install App</span>
        </button>

        {/* Install Banner (shows after delay) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40 p-4">
          <div className="flex items-center justify-between max-w-sm mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center">
                <img 
                  src="/Logo-removebg-preview (1).png" 
                  alt="HandyNaija" 
                  className="w-8 h-8"
                />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">HandyNaija</h4>
                <p className="text-xs text-gray-600">Install for better experience</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                onClick={handleInstallClick}
                className="bg-forest-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-forest-700 transition-colors"
              >
                Install
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}