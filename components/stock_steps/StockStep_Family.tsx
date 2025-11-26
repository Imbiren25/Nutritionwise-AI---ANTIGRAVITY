import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useStockInventory } from '../../hooks/useStockInventory';
import { FamilyMember } from '../../types';
import NumericStepper from '../NumericStepper';
import { analyticsService } from '../../services/analyticsService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Button } from '../ui/Button';
import Badge from '../ui/Badge';
import { Users, Plus, Trash2, ChevronDown, ChevronUp, Loader2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '../ui/Tabs';

const calculateCU = (member: Omit<FamilyMember, 'id' | 'cu'>): number => {
    if (member.age < 1) return 0.2;
    if (member.age <= 3) return 0.4;
    if (member.age <= 6) return 0.6;
    if (member.age <= 10) return 0.8;
    if (member.sex === 'Female') return 0.9;
    if (member.sex === 'Male') return 1.0;
    return 1.0;
};

const initialMemberState = { name: '', age: 0, sex: 'Male' as const, physiologicalState: 'NPNL' as const, activityLevel: 'Sedentary' as const };

const StockStep_Family: React.FC<ReturnType<typeof useStockInventory>> = ({ data, updateData }) => {
    const [newMember, setNewMember] = useState<Omit<FamilyMember, 'id' | 'cu'>>(initialMemberState);
    const [showAnthropometry, setShowAnthropometry] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);
    const [mobileTab, setMobileTab] = useState<'add' | 'list'>('add');

    const handleAddMember = () => {
        if (!newMember.name || newMember.age < 0) {
            alert("Please provide a valid name and age.");
            return;
        }
        const cu = calculateCU(newMember);
        const memberWithId: FamilyMember = { ...newMember, id: crypto.randomUUID(), cu };
        const updatedMembers = [...data.sectionE.familyMembers, memberWithId];
        updateData('sectionE', { familyMembers: updatedMembers });
        analyticsService.logEvent('add_family_member', { relation: 'unknown', age: newMember.age });
        setNewMember(initialMemberState);
        setShowAnthropometry(false);
        setMobileTab('list'); // Switch to list view after adding
    };

    const handleRemoveMember = (id: string) => {
        const updatedMembers = data.sectionE.familyMembers.filter(m => m.id !== id);
        updateData('sectionE', { familyMembers: updatedMembers });
    };

    const updateTotalCU = useCallback(() => {
        setIsCalculating(true);
        const timer = setTimeout(() => {
            const totalCU = data.sectionE.familyMembers.reduce((sum, member) => sum + member.cu, 0);
            updateData('sectionE', { totalCU });
            setIsCalculating(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [data.sectionE.familyMembers, updateData]);

    useEffect(() => {
        const cancel = updateTotalCU();
        return cancel;
    }, [updateTotalCU]);

    const ageCategory = useMemo(() => {
        const age = newMember.age;
        if (age < 1) return 'Infant';
        if (age < 5) return 'Young Child';
        if (age < 19) return 'Child/Adolescent';
        return 'Adult';
    }, [newMember.age]);

    return (
        <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold font-heading">Family Composition</h1>
                <p className="text-muted-foreground">Add family members to calculate total consumption units.</p>
            </div>

            {/* Mobile Tabs */}
            <div className="lg:hidden">
                <Tabs defaultValue="add" value={mobileTab} onValueChange={(v) => setMobileTab(v as 'add' | 'list')} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="add">Add Member</TabsTrigger>
                        <TabsTrigger value="list">
                            Family List
                            <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                                {data.sectionE.familyMembers.length}
                            </Badge>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Panel - Add Member */}
                <div className={cn("lg:col-span-2 space-y-4", mobileTab === 'add' ? "block" : "hidden lg:block")}>
                    <Card className="h-full border-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Users className="w-5 h-5 text-primary" />
                                Add New Member
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter name"
                                        value={newMember.name}
                                        onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                                        className="bg-muted/50"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="age">Age (Years)</Label>
                                        <NumericStepper value={newMember.age} onChange={age => setNewMember({ ...newMember, age })} min={0} max={120} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sex">Sex</Label>
                                        <Select value={newMember.sex} onValueChange={(value: any) => setNewMember({ ...newMember, sex: value })}>
                                            <SelectTrigger id="sex" className="bg-muted/50">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                {newMember.age === 0 && <p className="text-xs text-muted-foreground">Use 0 for infants &lt; 1 year</p>}
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowAnthropometry(!showAnthropometry)}
                                    className="w-full justify-between text-muted-foreground hover:text-foreground"
                                >
                                    <span>{showAnthropometry ? 'Hide' : 'Add'} Anthropometry (Optional)</span>
                                    {showAnthropometry ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </Button>
                            </div>

                            {showAnthropometry && (
                                <div className="grid grid-cols-2 gap-3 p-4 bg-muted/50 rounded-lg animate-in fade-in slide-in-from-top-2 duration-200 border border-border">
                                    {ageCategory === 'Infant' ? (
                                        <>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs">Birth Weight (kg)</Label>
                                                <Input type="number" placeholder="3.2" className="text-sm h-8" value={newMember.birthWeight || ''} onChange={e => setNewMember({ ...newMember, birthWeight: parseFloat(e.target.value) })} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs">Length (cm)</Label>
                                                <Input type="number" placeholder="50" className="text-sm h-8" value={newMember.birthLength || ''} onChange={e => setNewMember({ ...newMember, birthLength: parseFloat(e.target.value) })} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs">Weight (kg)</Label>
                                                <Input type="number" placeholder="kg" className="text-sm h-8" value={newMember.weight || ''} onChange={e => setNewMember({ ...newMember, weight: parseFloat(e.target.value) })} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs">Height (cm)</Label>
                                                <Input type="number" placeholder="cm" className="text-sm h-8" value={newMember.height || ''} onChange={e => setNewMember({ ...newMember, height: parseFloat(e.target.value) })} />
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            <Button onClick={handleAddMember} className="w-full gap-2 mt-4">
                                <Plus className="w-4 h-4" />
                                Add Member
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Panel - Family List */}
                <div className={cn("lg:col-span-3 space-y-4", mobileTab === 'list' ? "block" : "hidden lg:block")}>
                    {/* Total CU Card */}
                    <Card className="border-primary/20 bg-primary/5">
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Total Consumption Units (CU)</h4>
                                <p className="text-xs text-muted-foreground mt-1">Based on age and sex of all members</p>
                            </div>
                            <div className="text-right">
                                {isCalculating ? (
                                    <Loader2 className="animate-spin h-6 w-6 text-primary" />
                                ) : (
                                    <p className="text-3xl font-bold text-primary">{data.sectionE.totalCU.toFixed(2)}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-2">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl">Family Members</CardTitle>
                                <Badge variant="secondary">{data.sectionE.familyMembers.length} members</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {data.sectionE.familyMembers.length > 0 ? (
                                <div className="space-y-3">
                                    {data.sectionE.familyMembers.map(member => (
                                        <div
                                            key={member.id}
                                            className="flex items-center justify-between p-4 bg-card rounded-lg border shadow-sm hover:shadow-md transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                                    <User className="w-5 h-5 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{member.name}</p>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span>{member.age} yrs</span>
                                                        <span>•</span>
                                                        <span>{member.sex}</span>
                                                        {member.weight && <span>• {member.weight}kg</span>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <Badge variant="outline" className="hidden sm:flex">
                                                    CU: {member.cu.toFixed(1)}
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveMember(member.id)}
                                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                    <Users className="w-12 h-12 mb-4 opacity-20" />
                                    <p>No family members added yet.</p>
                                    <p className="text-sm">Add members to calculate household requirements.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default StockStep_Family;