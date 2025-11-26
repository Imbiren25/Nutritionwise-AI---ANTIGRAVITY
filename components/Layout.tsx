import React from 'react';
import { Page, User, AppNotification, FeatureFlags } from '../types';
import Icon from './Icon';
import Logo from './Logo';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useSync } from '../hooks/useSync';
import InactivityWarningModal from './InactivityWarningModal';
import SyncConflictModal from './SyncConflictModal';
import EnvironmentBanner from './EnvironmentBanner';
import RemoteBanner from './RemoteBanner';
import { Button } from './ui/Button';
import { useTheme } from '../hooks/useTheme';
import { useDeviceMode } from '../hooks/useDeviceMode';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from './ui/Sheet';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar';
import { ScrollArea } from './ui/ScrollArea';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activePage: Page;
  setActivePage: (page: Page) => void;
  user: User;
  onLogout: () => void;
  syncHook: ReturnType<typeof useSync>;
  isWarningVisible: boolean;
  onStay: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  remoteMessage: string;
  featureFlags: FeatureFlags;
}

const navItems: { id: Page; label: string; icon: keyof typeof Icon.icons }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'assessments', label: 'Assessments', icon: 'checklist' },
  { id: 'games', label: 'Games', icon: 'games' },
  { id: 'ai-assistant', label: 'AI Assistant', icon: 'ai' },
  { id: 'reports', label: 'Reports', icon: 'description' },
  { id: 'profile', label: 'Profile', icon: 'person' },
];

const Layout: React.FC<LayoutProps> = ({
  children, activePage, setActivePage, user, onLogout, syncHook,
  isWarningVisible, onStay, notifications, onMarkAsRead, remoteMessage, featureFlags
}) => {
  const isOnline = useOnlineStatus();
  const { isSyncing, syncNow, showConflictModal, resolveConflict } = syncHook;
  const [showRemoteBanner, setShowRemoteBanner] = React.useState(!!remoteMessage);
  const deviceMode = useDeviceMode();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const unreadCount = notifications.filter(n => !n.read).length;

  React.useEffect(() => {
    setSidebarOpen(deviceMode === 'desktop');
  }, [deviceMode]);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col md:flex-row">
      {isWarningVisible && <InactivityWarningModal onStay={onStay} onLogout={onLogout} />}
      {showConflictModal && <SyncConflictModal onResolve={resolveConflict} />}

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col border-r bg-card/50 backdrop-blur-xl transition-all duration-300 ease-in-out z-20 h-screen sticky top-0",
        sidebarOpen ? "w-72" : "w-20 items-center"
      )}>
        <div className={cn("h-20 flex items-center px-6 border-b", !sidebarOpen && "justify-center px-0")}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-sm">
              <Logo className="h-6 w-6 text-primary" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight leading-none">NutritionWise</span>
                <span className="text-xs text-muted-foreground font-medium mt-1">AI-Powered Health</span>
              </div>
            )}
          </div>
        </div>

        <ScrollArea className="flex-1 py-6 px-3">
          <div className="space-y-1">
            {navItems.map(item => {
              const isActive = activePage === item.id;
              const isAiDisabledByFlag = item.id === 'ai-assistant' && !featureFlags.enable_ai_chat;
              const isDisabled = (item.id === 'ai-assistant' && !isOnline) || isAiDisabledByFlag;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start relative overflow-hidden group transition-all duration-200",
                    isActive ? "bg-primary/10 text-primary hover:bg-primary/15 font-semibold" : "text-muted-foreground hover:text-foreground",
                    !sidebarOpen && "justify-center px-0 h-12 w-12 rounded-xl"
                  )}
                  onClick={() => setActivePage(item.id)}
                  disabled={isDisabled}
                >
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />}
                  <Icon name={item.icon} className={cn("h-5 w-5 transition-transform duration-200 group-hover:scale-110", sidebarOpen && "mr-3", isActive && "text-primary")} />
                  {sidebarOpen && <span>{item.label}</span>}
                </Button>
              )
            })}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-card/50 backdrop-blur-sm">
          {sidebarOpen ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-2 rounded-xl bg-secondary/50 border border-border/50">
                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center gap-2 h-9"
                  onClick={syncNow}
                  disabled={isSyncing}
                >
                  <Icon name={isSyncing ? "loader" : "checklist"} className={cn("h-3.5 w-3.5", isSyncing && "animate-spin")} />
                  Sync
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center gap-2 h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={onLogout}
                >
                  <Icon name="logout" className="h-3.5 w-3.5" />
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={onLogout}
              >
                <Icon name="logout" className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden bg-muted/10 pb-20 md:pb-0">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b flex items-center justify-between px-4 bg-background/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2 h-12 w-12">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[85vw] max-w-xs border-r-0">
                <SheetHeader className="h-20 flex flex-row items-center px-6 border-b space-y-0 gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Logo className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex flex-col items-start">
                    <SheetTitle className="text-lg font-bold tracking-tight">NutritionWise</SheetTitle>
                    <span className="text-xs text-muted-foreground font-medium">AI-Powered Health</span>
                  </div>
                </SheetHeader>
                <div className="flex flex-col h-[calc(100%-5rem)]">
                  <ScrollArea className="flex-1 py-6 px-4">
                    <div className="space-y-1">
                      {navItems.map(item => (
                        <Button
                          key={item.id}
                          variant={activePage === item.id ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start h-12 text-base font-medium",
                            activePage === item.id && "bg-primary/10 text-primary"
                          )}
                          onClick={() => {
                            setActivePage(item.id);
                          }}
                        >
                          <Icon name={item.icon} className="h-5 w-5 mr-3" />
                          {item.label}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-6 border-t bg-muted/30 mt-auto">
                    <div className="flex items-center gap-3 mb-6">
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full justify-start h-12"
                      onClick={onLogout}
                    >
                      <Icon name="logout" className="h-4 w-4 mr-2" />
                      Log Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <span className="font-bold text-lg tracking-tight">NutritionWise</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <Logo className="h-5 w-5 text-primary" />
          </div>
        </header>

        {/* Top Bar (Desktop) */}
        <header className="hidden md:flex h-20 border-b items-center justify-between px-8 bg-background/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground hover:text-foreground">
              <Icon name={sidebarOpen ? "chevronLeft" : "chevronRight"} className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{navItems.find(n => n.id === activePage)?.label}</h1>
              <p className="text-sm text-muted-foreground">Manage your health journey</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="relative rounded-full h-10 w-10 border-border/60 bg-background/50">
              <Icon name="checklist" className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-destructive border-2 border-background" />
              )}
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto space-y-8">
            <EnvironmentBanner />
            {showRemoteBanner && remoteMessage && <RemoteBanner message={remoteMessage} onClose={() => setShowRemoteBanner(false)} />}
            <div className="animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
              {children}
            </div>
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/90 backdrop-blur-lg z-50 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] pb-safe">
          <div className="flex justify-around items-center h-16 px-1">
            {[
              navItems.find(i => i.id === 'home'),
              navItems.find(i => i.id === 'assessments'),
              navItems.find(i => i.id === 'games'),
              navItems.find(i => i.id === 'ai-assistant'),
              navItems.find(i => i.id === 'profile')
            ].filter(Boolean).map(item => {
              if (!item) return null;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 active:scale-95 touch-manipulation",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                  style={{ minHeight: '48px', minWidth: '48px' }}
                >
                  <div className={cn(
                    "p-1.5 rounded-xl transition-all duration-200",
                    isActive && "bg-primary/10 scale-110"
                  )}>
                    <Icon name={item.icon} className={cn("h-6 w-6", isActive && "fill-current")} />
                  </div>
                  <span className={cn("text-[10px] font-medium transition-all duration-200", isActive && "font-bold")}>{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
