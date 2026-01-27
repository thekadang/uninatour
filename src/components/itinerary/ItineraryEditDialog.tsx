import { Plane, Train, Car, Bus, Trash2, Ship } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DayData, COLOR_OPTIONS } from '../../utils/itinerary-utils';
import { useState, useEffect } from 'react';

interface Props {
    editingDay: DayData | null;
    onClose: () => void;
    onSave: (data: { country: string; city: string; transport: 'plane' | 'train' | 'car' | 'bus' | 'ship' | 'none'; color: string }) => void;
    onDelete: () => void;
    countryColors?: Record<string, string>;
}

export function ItineraryEditDialog({ editingDay, onClose, onSave, onDelete, countryColors }: Props) {
    const [editCountry, setEditCountry] = useState('');
    const [editCity, setEditCity] = useState('');
    const [editTransport, setEditTransport] = useState<'plane' | 'train' | 'car' | 'bus' | 'ship' | 'none'>('none');
    const [editCountryColor, setEditCountryColor] = useState('bg-blue-500');

    useEffect(() => {
        if (editingDay) {
            setEditCountry(editingDay.tripData?.country || '');
            setEditCity(editingDay.tripData?.city || '');
            setEditTransport(editingDay.tripData?.transport || 'none');

            if (editingDay.tripData?.country && countryColors?.[editingDay.tripData.country]) {
                setEditCountryColor(countryColors[editingDay.tripData.country]);
            } else {
                setEditCountryColor('bg-blue-500');
            }
        }
    }, [editingDay, countryColors]);

    if (!editingDay) return null;

    return (
        <Dialog open={!!editingDay} onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent className="print:hidden">
                <DialogHeader>
                    <DialogTitle>
                        일정 {editingDay.tripData ? '수정' : '추가'} - D{editingDay.dayNum} ({editingDay.dateNum}일)
                    </DialogTitle>
                    <DialogDescription>
                        여행 일정을 추가하거나 수정할 수 있습니다.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="country">국가</Label>
                        <Input
                            id="country"
                            value={editCountry}
                            onChange={(e) => {
                                const newCountry = e.target.value;
                                setEditCountry(newCountry);
                                if (newCountry && countryColors?.[newCountry]) {
                                    setEditCountryColor(countryColors[newCountry]);
                                }
                            }}
                            placeholder="예: 프랑스"
                        />
                    </div>

                    <div>
                        <Label htmlFor="city">도시</Label>
                        <Input
                            id="city"
                            value={editCity}
                            onChange={(e) => setEditCity(e.target.value)}
                            placeholder="예: 파리"
                        />
                    </div>

                    <div>
                        <Label htmlFor="color">국가 색상</Label>
                        <Select value={editCountryColor} onValueChange={setEditCountryColor}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {COLOR_OPTIONS.map((color) => (
                                    <SelectItem key={color.value} value={color.value}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-4 h-4 rounded-full ${color.value}`} />
                                            {color.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="transport">이동수단</Label>
                        <Select value={editTransport} onValueChange={(value: any) => setEditTransport(value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">없음</SelectItem>
                                <SelectItem value="plane">
                                    <div className="flex items-center gap-2">
                                        <Plane className="w-4 h-4" />
                                        비행기
                                    </div>
                                </SelectItem>
                                <SelectItem value="train">
                                    <div className="flex items-center gap-2">
                                        <Train className="w-4 h-4" />
                                        기차
                                    </div>
                                </SelectItem>
                                <SelectItem value="car">
                                    <div className="flex items-center gap-2">
                                        <Car className="w-4 h-4" />
                                        렌터카
                                    </div>
                                </SelectItem>
                                <SelectItem value="bus">
                                    <div className="flex items-center gap-2">
                                        <Bus className="w-4 h-4" />
                                        버스
                                    </div>
                                </SelectItem>
                                <SelectItem value="ship">
                                    <div className="flex items-center gap-2">
                                        <Ship className="w-4 h-4" />
                                        크루즈(배)
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    {editingDay.tripData && (
                        <Button variant="destructive" onClick={onDelete}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            삭제
                        </Button>
                    )}
                    <Button variant="outline" onClick={onClose}>
                        취소
                    </Button>
                    <Button onClick={() => onSave({ country: editCountry, city: editCity, transport: editTransport, color: editCountryColor })}>
                        저장
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
