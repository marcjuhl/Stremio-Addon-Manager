import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { AuthCard } from './components/AuthCard';
import { ActionBar } from './components/ActionBar';
import { AddonList } from './components/AddonList';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { HowToFindKeyModal } from './components/HowToFindKeyModal';
import { useToast } from './hooks/useToast';
import {
  fetchAddonCollection,
  saveAddonCollection,
  loginWithCredentials,
  getStoredAuthKey,
  saveStoredAuthKey,
  clearStoredAuthKey,
} from './services/stremioApi';
import { DEMO_ADDONS } from './services/demoAddons';
import { StremioAddonDescriptor, AuthMode } from './types/stremio';
import { Layers, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const { toasts, addToast, dismissToast } = useToast();

  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [authKey, setAuthKey] = useState<string>('');
  const [accountLabel, setAccountLabel] = useState<string>('');
  const [addons, setAddons] = useState<StremioAddonDescriptor[]>([]);
  const [initialAddons, setInitialAddons] = useState<StremioAddonDescriptor[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  // Detect whether working addons order differs from initial snapshot
  const hasUnsavedChanges = useMemo(() => {
    if (initialAddons.length === 0 && addons.length === 0) return false;
    return JSON.stringify(addons) !== JSON.stringify(initialAddons);
  }, [addons, initialAddons]);

  // Attempt auto-login on initial mount if authKey was saved previously
  useEffect(() => {
    const savedKey = getStoredAuthKey();
    if (savedKey) {
      setAuthKey(savedKey);
      setAccountLabel(`Key (${savedKey.substring(0, 6)}...)`);
      handleLoadKey(savedKey, false, true);
    }
  }, []);

  // Primary loader for Stremio Auth Key
  const handleLoadKey = async (key: string, remember: boolean, isAutoLoad = false) => {
    setIsLoading(true);
    try {
      const fetchedAddons = await fetchAddonCollection(key);
      setAddons(fetchedAddons);
      setInitialAddons(fetchedAddons);
      setAuthKey(key);
      setAuthMode('key');
      setAccountLabel(`Key (${key.substring(0, 6)}...)`);

      if (remember) {
        saveStoredAuthKey(key);
      }

      addToast({
        type: 'success',
        title: isAutoLoad ? 'Session Restored' : 'Addons Loaded Successfully',
        message: `Found ${fetchedAddons.length} installed addons synced with your Stremio profile.`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (isAutoLoad) {
        clearStoredAuthKey();
        setAuthKey('');
        setAccountLabel('');
      } else {
        addToast({
          type: 'error',
          title: 'Connection Failed',
          message: message,
          duration: 6000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Login with Email & Password
  const handleLoginWithCredentials = async (email: string, pass: string, remember: boolean) => {
    setIsLoading(true);
    try {
      const { authKey: newKey, email: loggedEmail } = await loginWithCredentials(email, pass);
      const fetchedAddons = await fetchAddonCollection(newKey);

      setAddons(fetchedAddons);
      setInitialAddons(fetchedAddons);
      setAuthKey(newKey);
      setAuthMode('credentials');
      setAccountLabel(loggedEmail || email);

      if (remember) {
        saveStoredAuthKey(newKey);
      }

      addToast({
        type: 'success',
        title: 'Logged in to Stremio',
        message: `Welcome ${loggedEmail || email}! Loaded ${fetchedAddons.length} addons.`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      addToast({
        type: 'error',
        title: 'Authentication Error',
        message: message,
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Start Demo Mode
  const handleStartDemo = () => {
    setAuthMode('demo');
    setAuthKey('demo-key');
    setAccountLabel('Sandbox Demo');
    setAddons(DEMO_ADDONS);
    setInitialAddons(DEMO_ADDONS);

    addToast({
      type: 'info',
      title: 'Demo Mode Activated',
      message: 'Drag and reorder addons to experience how the manager works.',
      duration: 5000,
    });
  };

  // Save Addon Order back to Stremio API
  const handleSaveOrder = async () => {
    if (authMode === 'demo') {
      setIsSaving(true);
      setTimeout(() => {
        setInitialAddons([...addons]);
        setIsSaving(false);
        addToast({
          type: 'success',
          title: 'Order Saved (Demo)',
          message: 'Simulated saving reordered addon list to Stremio servers.',
        });
      }, 600);
      return;
    }

    if (!authKey) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: 'No active Stremio session found. Please re-authenticate.',
      });
      return;
    }

    setIsSaving(true);
    try {
      await saveAddonCollection(authKey, addons);
      setInitialAddons([...addons]);

      addToast({
        type: 'success',
        title: 'Addon Order Synced!',
        message: 'Your new addon order was saved to Stremio. Changes are active on all devices.',
        duration: 5000,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: message,
        duration: 6000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset order to original snapshot
  const handleResetOrder = () => {
    setAddons([...initialAddons]);
    addToast({
      type: 'info',
      title: 'Order Reset',
      message: 'Restored original addon sequence.',
    });
  };

  // Refresh addon list from Stremio Cloud
  const handleRefresh = async () => {
    if (authMode === 'demo') {
      setAddons(DEMO_ADDONS);
      setInitialAddons(DEMO_ADDONS);
      addToast({
        type: 'info',
        title: 'Demo Refreshed',
        message: 'Reset demo addons to initial state.',
      });
      return;
    }

    if (!authKey) return;
    setIsRefreshing(true);
    try {
      const refreshed = await fetchAddonCollection(authKey);
      setAddons(refreshed);
      setInitialAddons(refreshed);
      addToast({
        type: 'success',
        title: 'Refreshed from Stremio',
        message: `Synced ${refreshed.length} addons with Stremio cloud.`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      addToast({
        type: 'error',
        title: 'Refresh Failed',
        message: message,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Backup / Export Addon Collection to JSON
  const handleExport = () => {
    try {
      const backupData = {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        totalAddons: addons.length,
        addons: addons,
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `stremio-addons-backup-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      addToast({
        type: 'success',
        title: 'Backup Created',
        message: `Exported ${addons.length} addons to JSON file.`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      addToast({
        type: 'error',
        title: 'Export Failed',
        message: message,
      });
    }
  };

  // Import JSON Backup
  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        let importedAddons: StremioAddonDescriptor[] = [];
        if (Array.isArray(parsed)) {
          importedAddons = parsed;
        } else if (parsed && Array.isArray(parsed.addons)) {
          importedAddons = parsed.addons;
        } else {
          throw new Error('Unrecognized JSON structure. Expected an array of Stremio addons.');
        }

        // Validate basic descriptor structure
        const valid = importedAddons.filter((a) => a && a.manifest && a.manifest.id);
        if (valid.length === 0) {
          throw new Error('No valid Stremio addon manifests found in the selected file.');
        }

        setAddons(valid);
        addToast({
          type: 'success',
          title: 'Backup Imported',
          message: `Loaded ${valid.length} addons. Click "Save & Sync Order" to push to Stremio.`,
          duration: 6000,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        addToast({
          type: 'error',
          title: 'Import Failed',
          message: message,
        });
      }
    };
    reader.readAsText(file);
  };

  // Logout / Disconnect
  const handleLogout = () => {
    clearStoredAuthKey();
    setAuthMode(null);
    setAuthKey('');
    setAccountLabel('');
    setAddons([]);
    setInitialAddons([]);
    setSearchQuery('');
    addToast({
      type: 'info',
      title: 'Disconnected',
      message: 'Your session has been cleared from this browser.',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stremio-bg text-gray-100 font-sans">
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Guide Modal */}
      <HowToFindKeyModal isOpen={showGuideModal} onClose={() => setShowGuideModal(false)} />

      {/* Sticky Navigation Header */}
      <Navbar
        authMode={authMode}
        accountLabel={accountLabel}
        onLogout={handleLogout}
        onOpenGuide={() => setShowGuideModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {!authMode ? (
          /* Unauthenticated State: Hero & Auth Card */
          <div className="py-6 sm:py-12 flex flex-col items-center">
            {/* Hero Pitch */}
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stremio-card border border-stremio-border text-xs text-stremio-accentLight font-medium mb-4 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Customize Stremio Catalog & Stream Priority
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Organize Your Stremio Addons with Ease
              </h1>
              <p className="mt-4 text-base sm:text-lg text-stremio-muted leading-relaxed">
                Reorder catalogs, move streaming providers to the top, and sync changes instantly across all your Stremio devices. Runs entirely inside your browser.
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-left">
                <div className="p-4 rounded-xl bg-stremio-surface/50 border border-stremio-border/60">
                  <div className="p-2 rounded-lg bg-stremio-accent/20 text-stremio-accentLight w-fit mb-2">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Instant Sync</h3>
                  <p className="text-xs text-stremio-muted mt-1">
                    Updates save directly to Stremio cloud and immediately reflect in desktop and TV apps.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stremio-surface/50 border border-stremio-border/60">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 w-fit mb-2">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">100% Client-Side</h3>
                  <p className="text-xs text-stremio-muted mt-1">
                    Zero middleman servers. Credentials and tokens never leave your personal browser.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stremio-surface/50 border border-stremio-border/60">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 w-fit mb-2">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Backup & Restore</h3>
                  <p className="text-xs text-stremio-muted mt-1">
                    Export your curated addon setup to JSON anytime to easily migrate or recover your list.
                  </p>
                </div>
              </div>
            </div>

            {/* Auth Form Card */}
            <AuthCard
              onLoginWithKey={handleLoadKey}
              onLoginWithCredentials={handleLoginWithCredentials}
              onStartDemo={handleStartDemo}
              isLoading={isLoading}
              initialKey={authKey}
              onOpenGuide={() => setShowGuideModal(true)}
            />
          </div>
        ) : (
          /* Authenticated / Demo State: Reordering Workspace */
          <div className="space-y-6">
            {/* Action Bar (Search, Save, Backup, Reset) */}
            <ActionBar
              totalCount={addons.length}
              hasUnsavedChanges={hasUnsavedChanges}
              isSaving={isSaving}
              isRefreshing={isRefreshing}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSave={handleSaveOrder}
              onReset={handleResetOrder}
              onRefresh={handleRefresh}
              onExport={handleExport}
              onImport={handleImport}
            />

            {/* Interactive Drag & Drop Addon List */}
            <AddonList
              addons={addons}
              onChange={setAddons}
              searchQuery={searchQuery}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
