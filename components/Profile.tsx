import React, { useState, useEffect, useRef } from 'react';
import { User, Page, AnalyticsSettings, Theme, FontSize, AppearanceSettings } from '../types';
import { analyticsService } from '../services/analyticsService';
import { appConfigService } from '../services/appConfigService';
import { useTheme } from '../hooks/useTheme';
import { useSync } from '../hooks/useSync';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import Badge from './ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "./ui/Dialog";
import { cn } from '@/lib/utils';
import {
    User as UserIcon,
    Camera,
    Sun,
    Moon,
    Monitor,
    Shield,
    Trash2,
    LogOut,
    RefreshCw,
    FileText,
    Settings,
    Palette,
    UserCircle,
    AlertTriangle,
    Check,
    ChevronRight,
    Mail,
    School,
    GraduationCap,
    Calendar
} from 'lucide-react';

interface ProfileProps {
    user: User;
    onUpdateUser: (data: Partial<User>) => void;
    onLogout: () => void;
    onDeleteAllData: () => void;
    onNavigate: (page: Page) => void;
    syncHook: ReturnType<typeof useSync>;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onLogout, onDeleteAllData, onNavigate, syncHook }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(user);
    const [analyticsSettings, setAnalyticsSettings] = useState<AnalyticsSettings>(analyticsService.getSettings());
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { settings, changeAppearance } = useTheme();
    const { isSyncing, lastSynced, syncNow } = syncHook;
    const isOnline = useOnlineStatus();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        setFormData(user);
    }, [user]);

    const handleSave = () => {
        onUpdateUser(formData);
        setIsEditing(false);
    }

    const handleDelete = () => {
        onDeleteAllData();
        setIsDeleteDialogOpen(false);
    };

    const handleSettingsChange = (key: keyof AnalyticsSettings, value: boolean) => {
        const newSettings = { ...analyticsSettings, [key]: value };
        setAnalyticsSettings(newSettings);
        analyticsService.updateSettings(newSettings);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    onUpdateUser({ avatarUrl: event.target.result as string });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar - Profile Summary */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-border/60 shadow-md overflow-hidden relative">
                        <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
                        <CardContent className="relative pt-0 pb-8 px-6 text-center -mt-16">
                            <div className="relative inline-block mb-4 group">
                                <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                                    <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                                        {user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-1 right-1 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-all shadow-lg ring-4 ring-background opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                            </div>

                            <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                            <p className="text-muted-foreground flex items-center justify-center gap-1.5 mt-1 text-sm">
                                <Mail className="w-3.5 h-3.5" />
                                {user.email}
                            </p>

                            <div className="flex flex-wrap gap-2 justify-center mt-6">
                                <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-medium bg-secondary/50">
                                    {user.course}
                                </Badge>
                                <Badge variant="neutral" className="px-2.5 py-0.5 text-xs font-medium border-primary/20 text-primary">
                                    Batch {user.batch}
                                </Badge>
                            </div>

                            <div className="mt-8 space-y-3">
                                <Button
                                    onClick={syncNow}
                                    disabled={isSyncing || !isOnline}
                                    variant="outline"
                                    className="w-full justify-between group border-primary/20 hover:border-primary/50 hover:bg-primary/5 h-11"
                                >
                                    <span className="flex items-center gap-2.5">
                                        <RefreshCw className={cn("w-4 h-4 text-primary", isSyncing && "animate-spin")} />
                                        <span className="font-medium">Sync Data</span>
                                    </span>
                                    {lastSynced && (
                                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                            {lastSynced.split(' ')[0]}
                                        </span>
                                    )}
                                </Button>

                                <Button
                                    onClick={onLogout}
                                    variant="ghost"
                                    className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-2.5 h-11"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-center">
                        <p className="text-xs text-muted-foreground/60">
                            NutritionWise AI v{appConfigService.getCurrentVersion()}
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-8 space-y-6">
                    <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full grid grid-cols-3 p-1 bg-muted/30 rounded-xl mb-6">
                            <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                Profile
                            </TabsTrigger>
                            <TabsTrigger value="appearance" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                Appearance
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                Settings
                            </TabsTrigger>
                        </TabsList>

                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                            <TabsContent value="profile" className="mt-0 space-y-6">
                                <Card className="border-border/60 shadow-sm">
                                    <CardHeader className="pb-4 border-b border-border/40">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                                    <UserCircle className="w-5 h-5 text-primary" />
                                                    Personal Details
                                                </CardTitle>
                                                <CardDescription>Manage your academic and personal information</CardDescription>
                                            </div>
                                            {!isEditing && (
                                                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="h-8">
                                                    Edit
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        {isEditing ? (
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Full Name</Label>
                                                    <Input
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                        className="bg-muted/30"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="college">College / Institution</Label>
                                                    <Input
                                                        id="college"
                                                        value={formData.college}
                                                        onChange={e => setFormData({ ...formData, college: e.target.value })}
                                                        className="bg-muted/30"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="course">Course / Program</Label>
                                                    <Input
                                                        id="course"
                                                        value={formData.course}
                                                        onChange={e => setFormData({ ...formData, course: e.target.value })}
                                                        className="bg-muted/30"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="batch">Batch Year</Label>
                                                    <Input
                                                        id="batch"
                                                        value={formData.batch}
                                                        onChange={e => setFormData({ ...formData, batch: e.target.value })}
                                                        className="bg-muted/30"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                                                <ProfileField icon={<UserCircle className="w-4 h-4" />} label="Full Name" value={user.name} />
                                                <ProfileField icon={<School className="w-4 h-4" />} label="College" value={user.college} />
                                                <ProfileField icon={<GraduationCap className="w-4 h-4" />} label="Course" value={user.course} />
                                                <ProfileField icon={<Calendar className="w-4 h-4" />} label="Batch Year" value={user.batch} />
                                            </div>
                                        )}
                                    </CardContent>
                                    {isEditing && (
                                        <CardFooter className="flex justify-end gap-3 bg-muted/20 border-t border-border/50 py-4">
                                            <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm">
                                                Cancel
                                            </Button>
                                            <Button onClick={handleSave} size="sm">
                                                Save Changes
                                            </Button>
                                        </CardFooter>
                                    )}
                                </Card>
                            </TabsContent>

                            <TabsContent value="appearance" className="mt-0 space-y-6">
                                <Card className="border-border/60 shadow-sm">
                                    <CardHeader className="pb-4 border-b border-border/40">
                                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                            <Palette className="w-5 h-5 text-primary" />
                                            Theme & Display
                                        </CardTitle>
                                        <CardDescription>Customize the application aesthetics</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-8 pt-6">
                                        <div className="space-y-4">
                                            <Label className="text-base font-medium">Color Theme</Label>
                                            <ThemeSelector settings={settings} onThemeChange={(theme) => changeAppearance({ theme })} />
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-base font-medium">Text Size</Label>
                                            <FontSizeSelector settings={settings} onSizeChange={(fontSize) => changeAppearance({ fontSize })} />
                                        </div>
                                        <div className="pt-6 border-t border-border/50">
                                            <ToggleSwitch
                                                label="High Contrast Text"
                                                description="Increase text weight for better readability"
                                                enabled={settings.boldText}
                                                onChange={(checked) => changeAppearance({ boldText: checked })}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="settings" className="mt-0 space-y-6">
                                <Card className="border-border/60 shadow-sm">
                                    <CardHeader className="pb-4 border-b border-border/40">
                                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                            <Settings className="w-5 h-5 text-primary" />
                                            Analytics & Privacy
                                        </CardTitle>
                                        <CardDescription>Control your data sharing preferences</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-1 pt-2">
                                        <ToggleSwitch
                                            label="Share Usage Analytics"
                                            description="Help us improve by sharing anonymous usage data"
                                            enabled={analyticsSettings.analyticsEnabled}
                                            onChange={(checked) => handleSettingsChange('analyticsEnabled', checked)}
                                        />
                                        <div className="h-px bg-border/40 mx-4" />
                                        <ToggleSwitch
                                            label="Crash Reporting"
                                            description="Automatically send reports when the app crashes"
                                            enabled={analyticsSettings.crashReportsEnabled}
                                            onChange={(checked) => handleSettingsChange('crashReportsEnabled', checked)}
                                        />
                                    </CardContent>
                                </Card>

                                <Card className="border-border/60 shadow-sm">
                                    <CardHeader className="pb-4 border-b border-border/40">
                                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-primary" />
                                            Data Management
                                        </CardTitle>
                                        <CardDescription>Manage your account data and onboarding</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-6">
                                        <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-muted/10 hover:bg-muted/20 transition-colors">
                                            <div className="space-y-1">
                                                <p className="font-medium text-sm">Reset Onboarding</p>
                                                <p className="text-xs text-muted-foreground">View the welcome screens again</p>
                                            </div>
                                            <Button
                                                onClick={() => {
                                                    localStorage.removeItem('onboardingComplete');
                                                    window.location.reload();
                                                }}
                                                variant="outline"
                                                size="sm"
                                                className="h-8"
                                            >
                                                Reset
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-muted/10 hover:bg-muted/20 transition-colors">
                                            <div className="space-y-1">
                                                <p className="font-medium text-sm">Privacy Policy</p>
                                                <p className="text-xs text-muted-foreground">Read how we handle data</p>
                                            </div>
                                            <Button
                                                onClick={() => onNavigate('privacy-policy')}
                                                variant="outline"
                                                size="sm"
                                                className="h-8"
                                            >
                                                View
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-destructive/20 shadow-sm overflow-hidden">
                                    <div className="h-1 bg-destructive/20" />
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-destructive">
                                            <Shield className="w-5 h-5" />
                                            Danger Zone
                                        </CardTitle>
                                        <CardDescription>Irreversible actions</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="p-4 border border-destructive/10 rounded-xl bg-destructive/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <p className="font-medium text-destructive text-sm">Delete All Data</p>
                                                <p className="text-xs text-destructive/70 max-w-xs">
                                                    Permanently delete all assessments and profile data. Cannot be undone.
                                                </p>
                                            </div>
                                            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="destructive" size="sm" className="w-full sm:w-auto shadow-sm">
                                                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                                                        Delete Data
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle className="flex items-center gap-2 text-destructive">
                                                            <AlertTriangle className="w-5 h-5" />
                                                            Confirm Deletion
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Are you absolutely sure? This will permanently delete your account data and log you out.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter className="gap-2 sm:gap-0">
                                                        <DialogClose asChild>
                                                            <Button variant="outline">Cancel</Button>
                                                        </DialogClose>
                                                        <Button variant="destructive" onClick={handleDelete}>
                                                            Yes, Delete Everything
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

const ThemeSelector: React.FC<{ settings: AppearanceSettings, onThemeChange: (theme: Theme) => void }> = ({ settings, onThemeChange }) => {
    const options: { value: Theme, label: string, icon: React.ReactNode }[] = [
        { value: 'light', label: 'Light', icon: <Sun className="w-5 h-5" /> },
        { value: 'dark', label: 'Dark', icon: <Moon className="w-5 h-5" /> },
        { value: 'system', label: 'System', icon: <Monitor className="w-5 h-5" /> },
    ];

    return (
        <div className="grid grid-cols-3 gap-3">
            {options.map(option => (
                <button
                    key={option.value}
                    onClick={() => onThemeChange(option.value)}
                    className={cn(
                        "flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 relative overflow-hidden",
                        settings.theme === option.value
                            ? 'border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20'
                            : 'border-border hover:border-primary/30 hover:bg-muted/30 text-muted-foreground hover:text-foreground'
                    )}
                >
                    {settings.theme === option.value && (
                        <div className="absolute top-2 right-2 text-primary">
                            <Check className="w-3 h-3" />
                        </div>
                    )}
                    {option.icon}
                    <span className="text-sm font-medium">{option.label}</span>
                </button>
            ))}
        </div>
    );
};

const FontSizeSelector: React.FC<{ settings: AppearanceSettings, onSizeChange: (size: FontSize) => void }> = ({ settings, onSizeChange }) => {
    const options: { value: FontSize, label: string, sizeClass: string }[] = [
        { value: 'small', label: 'Aa', sizeClass: 'text-sm' },
        { value: 'medium', label: 'Aa', sizeClass: 'text-base' },
        { value: 'large', label: 'Aa', sizeClass: 'text-lg' },
    ];

    return (
        <div className="grid grid-cols-3 gap-3">
            {options.map(option => (
                <button
                    key={option.value}
                    onClick={() => onSizeChange(option.value)}
                    className={cn(
                        "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 relative overflow-hidden",
                        settings.fontSize === option.value
                            ? 'border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20'
                            : 'border-border hover:border-primary/30 hover:bg-muted/30 text-muted-foreground hover:text-foreground'
                    )}
                >
                    {settings.fontSize === option.value && (
                        <div className="absolute top-2 right-2 text-primary">
                            <Check className="w-3 h-3" />
                        </div>
                    )}
                    <span className={cn("font-medium", option.sizeClass)}>{option.label}</span>
                    <span className="text-xs opacity-70 capitalize">{option.value}</span>
                </button>
            ))}
        </div>
    );
};

const ProfileField: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
        <div className="mt-1 text-muted-foreground/70 bg-muted/50 p-2 rounded-md">
            {icon}
        </div>
        <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-0.5">{label}</span>
            <span className="font-medium text-foreground text-base">{value}</span>
        </div>
    </div>
);

const ToggleSwitch: React.FC<{
    label: string;
    description?: string;
    enabled: boolean;
    onChange: (checked: boolean) => void
}> = ({ label, description, enabled, onChange }) => (
    <label className="flex items-center justify-between cursor-pointer p-4 rounded-xl hover:bg-muted/30 transition-all duration-200 group">
        <div className="flex-1 pr-4">
            <span className="text-sm font-medium block text-foreground group-hover:text-primary transition-colors">{label}</span>
            {description && (
                <span className="text-xs text-muted-foreground block mt-0.5">{description}</span>
            )}
        </div>
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => onChange(!enabled)}
            className={cn(
                "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                enabled ? "bg-primary" : "bg-neutral-200 dark:bg-neutral-700"
            )}
        >
            <span
                className={cn(
                    "inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform",
                    enabled ? "translate-x-5" : "translate-x-0.5"
                )}
            />
        </button>
    </label>
);

export default Profile;
