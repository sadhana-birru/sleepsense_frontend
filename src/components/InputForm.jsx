import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, UploadCloud, Activity, Clock, Moon, Sun, ToggleLeft, ToggleRight, HeartPulse, ChevronDown, Check, Square, Download } from 'lucide-react';
import { cn } from '../utils/cn';
import DataSourceSelector from './DataSourceSelector';
import { AudioRecorder } from '../utils/audioUtils';

function CustomSelect({ options, value, onChange, name, triggerClassName, dropdownClassName }) {
    const [isOpen, setIsOpen] = useState(false);
    
    // Normalize options into { label, value }
    const formattedOptions = Array.isArray(options) 
        ? options.map((opt, idx) => typeof opt === 'object' ? opt : { value: idx, label: opt })
        : [];

    const selectedOption = formattedOptions.find(opt => opt.value === Number(value) || opt.value === value);

    return (
        <div className="relative flex-1 focus-within:z-[100]" tabIndex={0} onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setIsOpen(false);
        }}>
            <div 
                className={cn(triggerClassName || "glass-input w-full pr-10 cursor-pointer flex items-center justify-between", isOpen && "ring-2 ring-cyan-400 border-cyan-400/50")}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={!selectedOption ? "text-gray-500" : "text-white whitespace-nowrap overflow-hidden text-ellipsis select-none"}>
                    {selectedOption ? selectedOption.label : "Select..."}
                </span>
                <ChevronDown size={14} className={cn("text-gray-400 transition-transform duration-300 shrink-0", isOpen && "rotate-180 text-cyan-400")} />
            </div>
            
            {isOpen && (
                <div className={cn("absolute z-50 w-full mt-2 bg-charcoal-800/95 backdrop-blur-3xl border border-white/10 shadow-2xl shadow-indigo-900/50 rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 p-2 max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-1", dropdownClassName)}>
                    {formattedOptions.map((opt) => {
                        const isSelected = Number(value) === opt.value || value === opt.value;
                        return (
                            <div 
                                key={opt.value}
                                className={cn(
                                    "px-4 py-2 cursor-pointer rounded-xl flex items-center justify-between transition-colors duration-200 select-none text-sm",
                                    isSelected 
                                        ? "bg-cyan-500/10 text-cyan-400 font-medium" 
                                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                                )}
                                onClick={() => {
                                    onChange({ target: { name, value: opt.value } });
                                    setIsOpen(false);
                                }}
                            >
                                <span>{opt.label}</span>
                                {isSelected && <Check size={14} className="text-cyan-400" />}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}

function TimePicker({ valueMins, name, onChange }) {
    let h = Math.floor(valueMins / 60);
    let m = valueMins % 60;
    let ampm = h >= 12 ? 'PM' : 'AM';
    let displayH = h % 12;
    if (displayH === 0) displayH = 12;

    const updateTime = (newH, newM, newAmpm) => {
        let hrs = parseInt(newH, 10);
        if (hrs === 12 && newAmpm === 'AM') hrs = 0;
        else if (hrs !== 12 && newAmpm === 'PM') hrs += 12;
        
        const timeStr = `${hrs.toString().padStart(2, '0')}:${parseInt(newM, 10).toString().padStart(2, '0')}`;
        onChange({ target: { name, value: timeStr } });
    };

    const minutesArray = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    return (
        <div className="relative flex bg-charcoal-950/50 backdrop-blur-md border border-white/10 rounded-2xl focus-within:ring-2 focus-within:ring-cyan-400 focus-within:border-cyan-400/50 shadow-inner focus-within:z-50">
            <CustomSelect
                name="hour"
                value={displayH}
                onChange={e => updateTime(e.target.value, m, ampm)}
                options={[...Array(12)].map((_, i) => ({ label: (i+1).toString(), value: i+1 }))}
                triggerClassName="bg-transparent text-white px-4 py-4 cursor-pointer outline-none flex items-center justify-between hover:bg-white/5 transition-colors rounded-l-2xl w-full"
                dropdownClassName="min-w-[5rem]"
            />
            <span className="flex items-center text-gray-500 py-4 font-bold select-none">:</span>
            <CustomSelect
                name="minute"
                value={m.toString().padStart(2, '0')}
                onChange={e => updateTime(displayH, e.target.value, ampm)}
                options={minutesArray.map(min => ({ label: min, value: min }))}
                triggerClassName="bg-transparent text-white px-4 py-4 cursor-pointer outline-none flex items-center justify-between hover:bg-white/5 transition-colors w-full"
                dropdownClassName="min-w-[5rem]"
            />
            <div className="w-[1px] bg-white/10 my-2"></div>
            <CustomSelect
                name="ampm"
                value={ampm}
                onChange={e => updateTime(displayH, m, e.target.value)}
                options={[{ label: 'AM', value: 'AM' }, { label: 'PM', value: 'PM' }]}
                triggerClassName="bg-transparent text-cyan-400 font-bold px-4 py-4 cursor-pointer outline-none flex items-center justify-between hover:bg-white/5 transition-colors rounded-r-2xl w-full"
                dropdownClassName="min-w-[5rem] -right-2"
            />
        </div>
    );
}

const OCCUPATIONS = [
    "Not Specified", "Tech/IT", "Healthcare", "Education", "Business/Finance",
    "Shift Worker", "Creative", "Retail", "Student", "Unemployed", "Retired"
];

export default function InputForm({ onSubmit, isLoading }) {
    const [formData, setFormData] = useState({
        demographics: {
            age: 30,
            gender: 1, // 0=Female, 1=Male, 2=Other
            occupation: 0
        },
        biometrics: {
            work_hours: 8,
            sleep_duration: 7,
            sleep_latency: 20,
            wake_count: 1,
            bedtime_num: 1380, // 23:00
            waketime_num: 420, // 07:00
            stress_level_num: 1
        },
        smartwatch: {
            has_smartwatch: false,
            deep_sleep_percent: 20,
            rem_sleep_percent: 22,
            sleep_efficiency: 85
        },
        text_message: ""
    });

    const [audioFile, setAudioFile] = useState(null);

    const [dataSource, setDataSource] = useState('manual');
    const [fitbitData, setFitbitData] = useState(null);
    const [isFitbitConnected, setIsFitbitConnected] = useState(false);
    const [fitbitDate, setFitbitDate] = useState(new Date().toISOString().split('T')[0]);

    const [isRecording, setIsRecording] = useState(false);
    const recorderRef = useRef(null);

    useEffect(() => {
        const checkFitbitStatus = async () => {
            try {
                const response = await fetch('/api/auth/fitbit/status', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setIsFitbitConnected(data.connected);
                }
            } catch (error) {
                console.error('Error checking Fitbit status:', error);
                setIsFitbitConnected(false);
            }
        };

        checkFitbitStatus();
    }, []);

    const handleDataSourceChange = (newSource) => {
        setDataSource(newSource);
    };

    const handleFitbitDataUpdate = (data) => {
        setFitbitData(data);
        
        // Auto-populate form fields with Fitbit data when using Fitbit or mixed source
        if (dataSource === 'fitbit' || dataSource === 'mixed') {
            const updatedFormData = { ...formData };
            
            if (data) {
                updatedFormData.biometrics.sleep_duration = Math.round((data.total_minutes_asleep || 0) / 60 * 10) / 10;
                updatedFormData.biometrics.wake_count = data.sleep_stages?.wake ? Math.round(data.sleep_stages.wake / 15) : 1;
                updatedFormData.smartwatch.has_smartwatch = true;
                updatedFormData.smartwatch.deep_sleep_percent = data.sleep_stages?.deep ? Math.round((data.sleep_stages.deep / data.total_minutes_asleep) * 100) : 20;
                updatedFormData.smartwatch.rem_sleep_percent = data.sleep_stages?.rem ? Math.round((data.sleep_stages.rem / data.total_minutes_asleep) * 100) : 22;
                updatedFormData.smartwatch.sleep_efficiency = data.sleep_efficiency || 85;
                
                // Update bedtime and waketime if available
                if (data.sleep_start_time) {
                    const startTime = new Date(data.sleep_start_time);
                    updatedFormData.biometrics.bedtime_num = startTime.getHours() * 60 + startTime.getMinutes();
                }
                if (data.sleep_end_time) {
                    const endTime = new Date(data.sleep_end_time);
                    updatedFormData.biometrics.waketime_num = endTime.getHours() * 60 + endTime.getMinutes();
                }
            }
            
            setFormData(updatedFormData);
        }
    };

    const handleDemographicChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev, demographics: { ...prev.demographics, [name]: value === '' ? '' : Number(value) }
        }));
    };

    const handleBiometricChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev, biometrics: { ...prev.biometrics, [name]: value === '' ? '' : Number(value) }
        }));
    };

    
    const timeToMins = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
    };

    
    const handleTimeChange = (e) => {
        const { name, value } = e.target;
        const mins = timeToMins(value);
        setFormData(prev => ({
            ...prev, biometrics: { ...prev.biometrics, [name]: mins }
        }));
    };

    const startRecording = async () => {
        try {
            if (!recorderRef.current) {
                recorderRef.current = new AudioRecorder();
            }
            await recorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording:', err);
            alert('Could not access microphone. Please check permissions.');
        }
    };

    const stopRecording = () => {
        if (recorderRef.current && isRecording) {
            const blob = recorderRef.current.stop();
            setIsRecording(false);
            
            // Create a file from the blob to behave like an uploaded file
            const file = new File([blob], `recorded_voice_${Date.now()}.wav`, { type: 'audio/wav' });
            setAudioFile(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Include data source information in the submission
        const submissionData = {
            ...formData,
            metadata: {
                dataSource: dataSource,
                fitbitAvailable: !!fitbitData,
                submittedAt: new Date().toISOString()
            }
        };
        
        onSubmit(submissionData, audioFile);
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* 1. Demographics */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 mb-4 border-b border-white/10 pb-2">
                    <Activity size={20} />
                    <h2 className="text-lg font-semibold tracking-wide uppercase">Demographics</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 font-medium">Age</label>
                        <input 
                            type="number" 
                            name="age" 
                            value={formData.demographics.age} 
                            onChange={handleDemographicChange} 
                            className={`glass-input w-full ${formData.demographics.age < 15 ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : ''}`} 
                            min="1" 
                            max="100" 
                        />
                        {formData.demographics.age < 15 && (
                            <p className="text-[10px] text-red-400 font-bold animate-pulse">Age must be 15 or greater.</p>
                        )}
                    </div>
                    <div className="space-y-2 relative focus-within:z-50">
                        <label className="text-sm text-gray-400 font-medium">Gender</label>
                        <CustomSelect 
                            name="gender" 
                            value={formData.demographics.gender} 
                            onChange={handleDemographicChange} 
                            options={[{label: 'Female', value: 0}, {label: 'Male', value: 1}, {label: 'Other', value: 2}]} 
                        />
                    </div>
                    <div className="space-y-2 relative focus-within:z-50">
                        <label className="text-sm text-gray-400 font-medium">Occupation</label>
                        <CustomSelect 
                            name="occupation" 
                            value={formData.demographics.occupation} 
                            onChange={handleDemographicChange} 
                            options={OCCUPATIONS.map((occ, idx) => ({label: occ, value: idx}))} 
                        />
                    </div>
                </div>
            </section>

            {/* 2. Biometrics */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 mb-4 border-b border-white/10 pb-2">
                    <Clock size={20} />
                    <h2 className="text-lg font-semibold tracking-wide uppercase">Daily Biometrics</h2>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm text-gray-400 font-medium">Work Hours</label>
                            <span className="text-sm text-cyan-400 font-semibold">{formData.biometrics.work_hours}h</span>
                        </div>
                        <input type="range" name="work_hours" min="0" max="24" step="0.5" value={formData.biometrics.work_hours} onChange={handleBiometricChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 relative focus-within:z-50">
                            <label className="text-sm text-gray-400 font-medium flex items-center gap-2"><Moon size={14} /> Bedtime</label>
                            <TimePicker name="bedtime_num" valueMins={formData.biometrics.bedtime_num} onChange={handleTimeChange} />
                        </div>
                        <div className="space-y-2 relative focus-within:z-50">
                            <label className="text-sm text-gray-400 font-medium flex items-center gap-2"><Sun size={14} /> Wake-time</label>
                            <TimePicker name="waketime_num" valueMins={formData.biometrics.waketime_num} onChange={handleTimeChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 font-medium">Actual Sleep (hrs)</label>
                            <input type="number" name="sleep_duration" step="0.1" value={formData.biometrics.sleep_duration} onChange={handleBiometricChange} className="glass-input w-full" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 font-medium">Wake Count</label>
                            <input type="number" name="wake_count" value={formData.biometrics.wake_count} onChange={handleBiometricChange} className="glass-input w-full" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm text-gray-400 font-medium">Sleep Latency (mins)</label>
                            <span className="text-sm text-cyan-400 font-semibold">{formData.biometrics.sleep_latency}m</span>
                        </div>
                        <input type="range" name="sleep_latency" min="0" max="180" step="5" value={formData.biometrics.sleep_latency} onChange={handleBiometricChange} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 font-medium block">Stress Level</label>
                        <div className="flex gap-2 p-1 bg-charcoal-700/50 rounded-xl">
                            {['Low', 'Medium', 'High'].map((lvl, idx) => (
                                <button
                                    type="button"
                                    key={lvl}
                                    onClick={() => setFormData(p => ({ ...p, biometrics: { ...p.biometrics, stress_level_num: idx } }))}
                                    className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
                                        formData.biometrics.stress_level_num === idx ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/40" : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {lvl}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Data Source Selection */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity size={18} className="text-blue-400" />
                        <span className="text-sm font-medium text-gray-200">Data Source & Date</span>
                    </div>
                    <div className="flex items-center gap-2 bg-charcoal-800/60 px-4 py-2 rounded-lg border border-white/5">
                        <Activity size={16} className="text-gray-400" />
                        <input
                            type="date"
                            value={fitbitDate}
                            onChange={(e) => setFitbitDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="bg-transparent text-sm text-gray-200 border-none outline-none cursor-pointer"
                        />
                    </div>
                </div>
                <DataSourceSelector
                    date={fitbitDate}
                    onDataSourceChange={handleDataSourceChange}
                    onFitbitDataUpdate={handleFitbitDataUpdate}
                    isFitbitConnected={isFitbitConnected}
                />
            </div>

            
            {/* 4. Mental & Vocal Check-in */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-rose-400 mb-4 border-b border-white/10 pb-2">
                    <Mic size={20} />
                    <h2 className="text-lg font-semibold tracking-wide uppercase">State Check-in</h2>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 font-medium">How are you feeling?</label>
                        <textarea
                            value={formData.text_message}
                            onChange={(e) => setFormData(p => ({ ...p, text_message: e.target.value }))}
                            className="glass-input w-full min-h-[100px] resize-y"
                            placeholder="E.g., I'm feeling exhausted today and can't focus on my tasks..."
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm text-gray-400 font-medium">Vocal Check-in (WAV format)</label>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Live Recording Option */}
                            <div className={cn(
                                "relative flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed transition-all duration-300",
                                isRecording ? "border-rose-500 bg-rose-500/5 shadow-[0_0_20px_rgba(244,63,94,0.1)]" : "border-white/10 hover:border-indigo-400/50 bg-charcoal-800/30"
                            )}>
                                {isRecording ? (
                                    <>
                                        <div className="flex items-center gap-3 animate-pulse">
                                            <div className="w-3 h-3 rounded-full bg-rose-500" />
                                            <span className="text-sm font-bold text-rose-500 uppercase tracking-wider">Recording...</span>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={stopRecording}
                                            className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors font-medium shadow-lg shadow-rose-500/20"
                                        >
                                            <Square size={16} fill="currentColor" />
                                            Stop Recording
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                            <Mic size={20} />
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={startRecording}
                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg transition-colors font-medium"
                                        >
                                            Start Live Recording
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* File Upload Option */}
                            <div className="relative group overflow-hidden rounded-xl border-2 border-dashed border-white/10 hover:border-cyan-400/50 transition-colors bg-charcoal-800/30">
                                <input
                                    type="file"
                                    accept="audio/wav"
                                    onChange={(e) => setAudioFile(e.target.files[0])}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    disabled={isRecording}
                                />
                                <div className="p-4 h-full flex flex-col items-center justify-center gap-2 text-gray-400 group-hover:text-cyan-400 transition-colors">
                                    <UploadCloud size={24} />
                                    <span className="text-sm font-medium text-center">
                                        {audioFile && !isRecording ? audioFile.name : "Click to upload .wav"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {audioFile && (
                            <div className="flex items-center gap-2 text-[11px] text-cyan-400 bg-cyan-400/5 px-3 py-1.5 rounded-lg border border-cyan-400/20 animate-in fade-in slide-in-from-top-1">
                                <Check size={12} />
                                <span className="font-medium">Ready: {audioFile.name}</span>
                                
                                <div className="ml-auto flex items-center gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            const url = URL.createObjectURL(audioFile);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = audioFile.name;
                                            a.click();
                                            URL.revokeObjectURL(url);
                                        }}
                                        className="flex items-center gap-1 text-cyan-400 hover:text-white transition-colors"
                                        title="Download to listen"
                                    >
                                        <Download size={12} />
                                        <span>Download</span>
                                    </button>
                                    
                                    <div className="w-[1px] h-3 bg-cyan-400/20" />
                                    
                                    <button 
                                        type="button" 
                                        onClick={() => setAudioFile(null)}
                                        className="text-gray-500 hover:text-rose-400 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <button type="submit" disabled={isLoading} className="glass-button w-full flex items-center justify-center gap-2 text-lg mt-8">
                {isLoading ? (
                    <span className="animate-pulse">Generating Report...</span>
                ) : (
                    <span>Generate Triple-Fusion Report</span>
                )}
            </button>

        </form>
    )
}