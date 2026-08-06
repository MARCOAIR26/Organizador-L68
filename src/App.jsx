import React, { useState, useRef, useEffect } from 'react';
import { 
    Building2, UserPlus, CalendarDays, CheckCircle2, AlertTriangle, 
    Trash2, ChevronDown, PlusCircle, Printer, Image as ImageIcon, 
    Home, BookOpen, Plane, FileText, ChevronRight, ChevronLeft, Download,
    ShieldCheck, LayoutDashboard, Users, GraduationCap,
    LogOut, Key, User, History, Search, Edit3, UserCog, Wand2, Filter,
    X, ClipboardList
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
            if (existingScript.dataset.loaded === 'true') {
                resolve();
            } else {
                existingScript.addEventListener('load', resolve);
                existingScript.addEventListener('error', reject);
            }
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            script.dataset.loaded = 'true';
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

const firebaseConfig = {
  apiKey: "AIzaSyB6h0JqtQGj35KNVQACsJrkg-l7oMlaT6U",
  authDomain: "organizador-de-cursos-l68.firebaseapp.com",
  projectId: "organizador-de-cursos-l68",
  storageBucket: "organizador-de-cursos-l68.firebasestorage.app",
  messagingSenderId: "994208231675",
  appId: "1:994208231675:web:bc9585bf63284e76b51916",
  measurementId: "G-T3VMCB0L2Q"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const docRef = doc(db, "sistema_l68", "datos_maestros");

const initialData = {
    empresas: [],
    alumnos: [],
    instructores: [],
    cursos: [],
    diagramas: [],
    ausencias: [],
    logs: [],
    usuarios: [ 
        { id: 'master', username: 'marcolg', password: '2601', name: 'Ing. Marco López', role: 'admin' }
    ]
};

const formatDateStr = (dateString) => {
    if (!dateString) return '';
    const date = new Date(`${dateString}T00:00:00`);
    const day = String(date.getDate()).padStart(2, '0');
    const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const getMexicanHoliday = (dateObj) => {
    if (!dateObj) return null;
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const dayOfWeek = dateObj.getDay();

    if (month === 1 && day === 1) return 'Año Nuevo';
    if (month === 5 && day === 1) return 'Día del Trabajo';
    if (month === 9 && day === 16) return 'Día de la Independencia';
    if (month === 12 && day === 25) return 'Navidad';
    if (month === 2 && dayOfWeek === 1 && day <= 7) return 'Día de la Constitución'; 
    if (month === 3 && dayOfWeek === 1 && day >= 15 && day <= 21) return 'Natalicio de Benito Juárez'; 
    if (month === 11 && dayOfWeek === 1 && day >= 15 && day <= 21) return 'Día de la Revolución'; 
    if (month === 10 && day === 1 && (year - 2024) % 6 === 0) return 'Transmisión del Poder Ejecutivo'; 

    return null;
};

function LoginScreen({ onLogin, data }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = data.usuarios?.find(u => u.username === username && u.password === password);
        
        if (user) {
            onLogin({ name: user.name, role: user.role, username: user.username });
        } else {
            setError('Usuario o contraseña incorrectos.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center -z-10 filter brightness-[0.3]" style={{ backgroundImage: `url('/BOEING.jpg?v=2')` }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent -z-10"></div>
            
            <div className="bg-slate-800/80 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-slate-700 max-w-md w-full animate-in fade-in zoom-in-95 duration-500 text-center">
                <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-700">
                    <ShieldCheck className="w-12 h-12 text-sky-400" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2">Acceso L68</h2>
                <p className="text-slate-400 mb-8 text-sm">Ingrese sus credenciales de acceso al portal.</p>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl flex items-center gap-2 text-sm text-left">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-left">
                        <label className="text-xs font-bold text-slate-400 ml-1">USUARIO</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full mt-1 p-4 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-sky-500 transition-colors"
                            placeholder="Ej. fulanito123"
                            required
                        />
                    </div>
                    <div className="text-left">
                        <label className="text-xs font-bold text-slate-400 ml-1">CONTRASEÑA</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-1 p-4 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-sky-500 transition-colors"
                            placeholder="••••"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        className="w-full mt-4 flex items-center justify-center gap-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white p-4 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-0.5"
                    >
                        <Key className="w-5 h-5" /> INICIAR SESIÓN
                    </button>
                </form>
            </div>
        </div>
    );
}

function GestorUsuarios({ data, setData, addLog, goBack }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('user');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username.trim() || !password.trim() || !name.trim()) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        if (data.usuarios.some(u => u.username.toLowerCase() === username.trim().toLowerCase())) {
            setError('Este nombre de usuario ya existe.');
            return;
        }
        
        const nuevoUser = { id: Date.now().toString(), username: username.trim(), password: password.trim(), name: name.trim(), role };
        setData({ ...data, usuarios: [...(data.usuarios || []), nuevoUser] });
        addLog('Administración', `Creó la cuenta de usuario "${nuevoUser.username}" (${nuevoUser.role})`);
        
        setMensaje('Usuario creado con éxito.');
        setError(''); setUsername(''); setPassword(''); setName(''); setRole('user');
        setTimeout(() => setMensaje(''), 3000);
    };

    const handleDelete = (id, usernameToDelete) => {
        if (usernameToDelete === 'marcolg') {
            setError('No se puede eliminar la cuenta de Administrador Principal.');
            setTimeout(() => setError(''), 3000);
            return;
        }
        setData({ ...data, usuarios: data.usuarios.filter(u => u.id !== id) });
        addLog('Administración', `Eliminó la cuenta de usuario "${usernameToDelete}"`);
    };

    return (
        <div className="relative min-h-[calc(100vh-5rem)] -m-4 md:-m-8 lg:-m-10 p-4 md:p-8 lg:p-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-900 -z-10"></div>
            
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl w-full mx-auto space-y-6">
                <div className="bg-slate-800/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-slate-700 text-white">
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={goBack} className="p-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition-colors shadow-sm" title="Página anterior">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="p-4 bg-purple-500/20 rounded-2xl text-purple-400 border border-purple-500/30">
                            <UserCog className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Gestión de Usuarios</h2>
                            <p className="text-slate-400 mt-1">Crea y administra los accesos al sistema L68</p>
                        </div>
                    </div>

                    {mensaje && (
                        <div className="mb-8 p-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 rounded-2xl flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 flex-shrink-0" /> <span className="font-medium">{mensaje}</span>
                        </div>
                    )}
                    {error && (
                        <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-2xl flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 flex-shrink-0" /> <span className="font-medium">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-slate-400 ml-1">NOMBRE COMPLETO</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 bg-slate-800 border border-slate-600 rounded-xl outline-none focus:border-purple-500 transition-all text-white placeholder:text-slate-500" placeholder="Ej. Ing. Marco López" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 ml-1">USUARIO DE ACCESO</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-4 bg-slate-800 border border-slate-600 rounded-xl outline-none focus:border-purple-500 transition-all text-white placeholder:text-slate-500" placeholder="Ej. mlopez" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 ml-1">CONTRASEÑA</label>
                            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-slate-800 border border-slate-600 rounded-xl outline-none focus:border-purple-500 transition-all text-white placeholder:text-slate-500" placeholder="Min. 6 caracteres" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-slate-400 ml-1">NIVEL DE PRIVILEGIO</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-4 bg-slate-800 border border-slate-600 rounded-xl outline-none focus:border-purple-500 transition-all text-white appearance-none cursor-pointer" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}>
                                <option value="user">Usuario Básico (Registros y Gantt)</option>
                                <option value="admin">Administrador (Acceso total, Logs y Usuarios)</option>
                                <option value="guest">Invitado (Modo Demo / Sin Guardado)</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 pt-2">
                            <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white p-4 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                <UserPlus className="w-5 h-5" /> CREAR USUARIO
                            </button>
                        </div>
                    </form>

                    <div className="mt-10">
                        <h3 className="text-lg font-bold mb-4">Usuarios Activos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...(data.usuarios || [])].sort((a, b) => a.name.localeCompare(b.name)).map(u => (
                                <div key={u.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${u.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : u.role === 'guest' ? 'bg-rose-500/20 text-rose-400' : 'bg-sky-500/20 text-sky-400'}`}>
                                            {u.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{u.name}</p>
                                            <div className="flex gap-2 items-center mt-0.5">
                                                <p className="text-xs text-slate-400">@{u.username}</p>
                                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${u.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : u.role === 'guest' ? 'bg-rose-500/20 text-rose-400' : 'bg-sky-500/20 text-sky-400'}`}>
                                                    {u.role.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {u.username !== 'marcolg' && (
                                        <button 
                                            onClick={() => handleDelete(u.id, u.username)}
                                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AuditLogs({ data, onClearLogs, goBack }) {
    const [confirmClear, setConfirmClear] = useState(false);

    const handleClear = () => {
        if (!confirmClear) {
            setConfirmClear(true);
            return;
        }
        onClearLogs();
        setConfirmClear(false);
    };

    return (
        <div className="relative min-h-[calc(100vh-5rem)] -m-4 md:-m-8 lg:-m-10 p-4 md:p-8 lg:p-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-900 -z-10"></div>
            
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl w-full mx-auto">
                <div className="bg-slate-800/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-slate-700 text-white">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <button onClick={goBack} className="p-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition-colors shadow-sm" title="Página anterior">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="p-4 bg-amber-500/20 rounded-2xl text-amber-400 border border-amber-500/30">
                                <History className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-extrabold text-white tracking-tight">Registro de Actividad</h2>
                                <p className="text-slate-400 mt-1">Historial de movimientos en el sistema</p>
                            </div>
                        </div>
                        {data.logs && data.logs.length > 0 && (
                            <button
                                onClick={handleClear}
                                className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                                    confirmClear 
                                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20' 
                                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600'
                                }`}
                            >
                                <Trash2 className="w-4 h-4" />
                                {confirmClear ? '¿VACIAR HISTORIAL?' : 'Limpiar Registro'}
                            </button>
                        )}
                    </div>

                    <div className="bg-slate-900/50 rounded-2xl border border-slate-700 overflow-hidden">
                        {!data.logs || data.logs.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No hay registros de actividad aún.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-800 border-b border-slate-700 text-slate-300 text-xs uppercase tracking-wider font-bold sticky top-0 z-10">
                                        <tr>
                                            <th className="px-6 py-4">Fecha y Hora</th>
                                            <th className="px-6 py-4">Usuario</th>
                                            <th className="px-6 py-4">Módulo</th>
                                            <th className="px-6 py-4">Acción Realizada</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50 text-sm">
                                        {[...data.logs].reverse().map(log => (
                                            <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4 text-slate-400 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                                                <td className="px-6 py-4 font-semibold text-sky-400">{log.user}</td>
                                                <td className="px-6 py-4 text-amber-400 font-medium">{log.module}</td>
                                                <td className="px-6 py-4 text-slate-200">{log.action}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const Navbar = ({ step, setStep, currentUser, onLogout }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const modules = [
        { id: 'empresa', label: 'Empresas', icon: Building2 },
        { id: 'alumno', label: 'Alumnos', icon: Users },
        { id: 'instructor', label: 'Instructores', icon: GraduationCap },
        { id: 'curso', label: 'Cursos', icon: BookOpen },
        { id: 'ausencias', label: 'Ausencias', icon: CalendarDays },
        { id: 'gantt', label: 'Gantt & IA', icon: LayoutDashboard },
        { id: 'reportes', label: 'Reportes PDF', icon: FileText }
    ];
    if (currentUser?.role === 'admin') modules.push({ id: 'users', label: 'Usuarios', icon: UserCog });

    return (
        <header className="bg-slate-900/95 backdrop-blur-md text-white sticky top-0 z-50 shadow-xl border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setStep('home')}>
                        <div className="bg-slate-800/80 p-2 rounded-xl group-hover:scale-105 transition-transform border border-slate-700 shadow-inner flex items-center justify-center">
                            <img 
                                src="/logo-ocean.png" 
                                alt="Logo Centro de Adiestramiento L68" 
                                className="w-10 h-10 object-contain [mix-blend-mode:screen] filter contrast-125 brightness-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" 
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg md:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-sky-300">
                                Centro L68
                            </h1>
                            <p className="text-[10px] uppercase tracking-widest text-sky-400 font-semibold">
                                Gestión de Cursos
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 md:gap-3">
                        
                        {/* AVISO MODO DEMO PARA INVITADOS */}
                        {currentUser?.role === 'guest' && (
                            <div className="hidden lg:flex items-center gap-1.5 bg-rose-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold animate-pulse shadow-lg">
                                <AlertTriangle className="w-4 h-4" /> MODO DEMO
                            </div>
                        )}

                        {/* MENÚ DE MÓDULOS RÁPIDO */}
                        {step !== 'home' && step !== 'login' && (
                            <div className="relative" ref={menuRef}>
                                <button 
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="flex items-center justify-center gap-2 px-3 md:px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition-all text-sm font-bold shadow-lg shadow-sky-600/20"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span className="hidden md:inline">Módulos</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                
                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                        <div className="p-3 border-b border-slate-100 bg-slate-50">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Navegación Rápida</p>
                                        </div>
                                        <div className="p-2 space-y-1">
                                            {modules.map(m => (
                                                <button
                                                    key={m.id}
                                                    onClick={() => { setStep(m.id); setMenuOpen(false); }}
                                                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${step === m.id ? 'bg-sky-50 text-sky-600 font-bold' : 'hover:bg-slate-50 text-slate-600 font-medium'}`}
                                                >
                                                    <m.icon className={`w-4 h-4 ${step === m.id ? 'text-sky-500' : 'text-slate-400'}`} /> {m.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* BOTÓN INICIO (HOME) */}
                        {step !== 'home' && step !== 'login' && (
                            <button 
                                onClick={() => setStep('home')}
                                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all border border-slate-700/60 shadow-lg"
                                title="Ir al Inicio (Panel Principal)"
                            >
                                <Home className="w-5 h-5 text-sky-400" />
                            </button>
                        )}

                        {currentUser?.role === 'admin' && step !== 'logs' && step !== 'login' && (
                            <button 
                                onClick={() => setStep('logs')}
                                className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-all text-sm font-bold border border-amber-500/20"
                            >
                                <History className="w-4 h-4" /> Logs
                            </button>
                        )}

                        {step !== 'login' && (
                            <>
                                <div className="h-8 w-px bg-slate-700 mx-1 hidden sm:block"></div>
                                <button 
                                    onClick={onLogout}
                                    className="p-2.5 sm:px-4 sm:py-2.5 flex items-center gap-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all text-sm font-bold"
                                    title="Cerrar Sesión"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="hidden sm:inline">Salir</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

function FormInstructor({ data, setData, addLog, goBack }) {
    const [nombre, setNombre] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nombre.trim()) { setError('El nombre del instructor es obligatorio.'); return; }
        
        if (editingId) {
            const isDuplicate = (data.instructores || []).some(inst => inst.id !== editingId && inst.nombre.toLowerCase() === nombre.trim().toLowerCase());
            if (isDuplicate) { setError('Este instructor ya existe.'); return; }
            setData({ ...data, instructores: (data.instructores || []).map(inst => inst.id === editingId ? { ...inst, nombre: nombre.trim() } : inst) });
            addLog('Instructores', `Actualizó el instructor a "${nombre.trim()}"`);
            setMensaje('Instructor actualizado con éxito.');
            setEditingId(null);
        } else {
            if ((data.instructores || []).some(inst => inst.nombre.toLowerCase() === nombre.trim().toLowerCase())) { setError('Este instructor ya está registrado.'); return; }
            const nuevoInstructor = { id: Date.now().toString(), nombre: nombre.trim() };
            setData({ ...data, instructores: [...(data.instructores || []), nuevoInstructor] });
            addLog('Instructores', `Registró al instructor "${nuevoInstructor.nombre}"`);
            setMensaje('Instructor registrado con éxito.');
        }
        setError(''); setNombre(''); setTimeout(() => setMensaje(''), 3000);
    };

    const handleEdit = (inst) => { setEditingId(inst.id); setNombre(inst.nombre); window.scrollTo({top:0, behavior:'smooth'}); };
    const handleDelete = (instructor) => {
        setData({ ...data, instructores: (data.instructores || []).filter(i => i.id !== instructor.id) });
        addLog('Instructores', `Eliminó al instructor "${instructor.nombre}"`);
    };

    return (
        <div className="relative min-h-[calc(100vh-5rem)] -m-4 md:-m-8 lg:-m-10 p-4 md:p-8 lg:p-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-cover bg-center -z-10 filter brightness-[0.75]" style={{ backgroundImage: `url('/PC-12 WALLPAPER.jfif')` }}></div>
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] -z-10"></div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl w-full mx-auto">
                <div className="bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-2xl shadow-slate-900/30 border border-white/80">
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={goBack} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors shadow-sm" title="Página anterior">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="p-4 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-2xl shadow-lg shadow-fuchsia-500/30 text-white">
                            <GraduationCap className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{editingId ? 'Editar Instructor' : 'Alta de Instructor'}</h2>
                            <p className="text-slate-500 mt-1">Gestión de la plantilla de instructores</p>
                        </div>
                    </div>
                    
                    {mensaje && <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-center gap-3 shadow-sm"><CheckCircle2 className="w-6 h-6 text-emerald-500" /> <span className="font-medium">{mensaje}</span></div>}
                    {error && <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-3 shadow-sm"><AlertTriangle className="w-6 h-6 text-red-500" /> <span className="font-medium">{error}</span></div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Nombre Completo del Instructor</label>
                            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition-all outline-none text-slate-700 placeholder:text-slate-400 shadow-sm" placeholder="Ej. Cap. Carlos Ruiz" />
                        </div>
                        <div className="pt-4 flex gap-4">
                            <button type="submit" className="flex-1 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white p-4 rounded-2xl font-bold text-lg shadow-lg shadow-fuchsia-500/30 transition-all hover:-translate-y-0.5 active:scale-[0.98]">
                                {editingId ? 'Actualizar Instructor' : 'Registrar Instructor'}
                            </button>
                            {editingId && <button type="button" onClick={()=>{setEditingId(null); setNombre('');}} className="px-6 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl font-bold transition-colors">Cancelar</button>}
                        </div>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Directorio de Instructores</h3>
                            <span className="bg-fuchsia-100 text-fuchsia-700 py-1 px-3 rounded-full text-sm font-bold">{(data.instructores || []).length} total</span>
                        </div>
                        
                        {(!data.instructores || data.instructores.length === 0) ? (
                            <div className="text-center py-10 bg-slate-50/80 rounded-3xl border border-slate-100 border-dashed">
                                <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium">Aún no hay instructores registrados.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-1">
                                {[...(data.instructores || [])].sort((a, b) => a.nombre.localeCompare(b.nombre)).map(inst => (
                                    <div key={inst.id} className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-fuchsia-300 hover:shadow-md transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-fuchsia-50 flex items-center justify-center text-fuchsia-600 font-bold text-lg">{inst.nombre.charAt(0).toUpperCase()}</div>
                                            <span className="font-bold text-slate-700 truncate max-w-[150px]" title={inst.nombre}>{inst.nombre}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleEdit(inst)} className="p-2 text-fuchsia-600 hover:bg-fuchsia-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"><Edit3 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(inst)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function FormCurso({ data, setData, addLog, goBack }) {
    const [nombre, setNombre] = useState('');
    const [horas, setHoras] = useState('');
    const [instructor, setInstructor] = useState('');
    const [modalidad, setModalidad] = useState('Presencial'); 
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null); 

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nombre.trim() || !horas || !instructor) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        const cursoData = {
            id: editingId || Date.now().toString(), 
            nombre: nombre.trim(), 
            horasTotales: parseInt(horas),
            instructor: instructor,
            modalidad
        };

        if (editingId) {
            setData({
                ...data,
                cursos: data.cursos.map(c => c.id === editingId ? cursoData : c),
                diagramas: (data.diagramas || []).map(d => ({
                    ...d,
                    programacion: d.programacion.map(p => p.curso.id === editingId ? { ...p, curso: cursoData } : p)
                }))
            });
            addLog('Cursos', `Editó el curso "${cursoData.nombre}"`);
            setMensaje('Curso actualizado con éxito.');
            setEditingId(null);
        } else {
            if (data.cursos.some(c => c.nombre.toLowerCase() === nombre.trim().toLowerCase() && c.instructor === instructor)) {
                setError('Este curso con el mismo instructor ya está registrado.');
                return;
            }
            setData({ ...data, cursos: [...data.cursos, cursoData] });
            addLog('Cursos', `Registró el curso "${cursoData.nombre}" (${cursoData.modalidad}) impartido por ${cursoData.instructor}`);
            setMensaje('Curso registrado con éxito.');
        }
        
        setError(''); setNombre(''); setHoras(''); setInstructor(''); setModalidad('Presencial');
        setTimeout(() => setMensaje(''), 3000);
    };

    const handleEdit = (c) => {
        setEditingId(c.id);
        setNombre(c.nombre);
        setHoras(c.horasTotales);
        setInstructor(c.instructor);
        setModalidad(c.modalidad || 'Presencial');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (curso) => {
        setData({
            ...data,
            cursos: data.cursos.filter(c => c.id !== curso.id),
            diagramas: (data.diagramas || []).map(d => ({
                ...d,
                programacion: d.programacion.filter(p => p.curso.id !== curso.id)
            }))
        });
        addLog('Cursos', `Eliminó el curso "${curso.nombre}"`);
    };

    return (
        <div className="relative min-h-[calc(100vh-5rem)] -m-4 md:-m-8 lg:-m-10 p-4 md:p-8 lg:p-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-cover bg-center -z-10 filter brightness-[0.75]" style={{ backgroundImage: `url('/PC-12 WALLPAPER.jfif')` }}></div>
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] -z-10"></div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl w-full mx-auto">
                <div className="bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-2xl shadow-slate-900/30 border border-white/80">
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={goBack} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors shadow-sm" title="Página anterior">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="p-4 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl shadow-lg shadow-indigo-500/30 text-white">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Catálogo de Cursos</h2>
                            <p className="text-slate-500 mt-1">Registra las materias e instructores autorizados</p>
                        </div>
                    </div>
                    
                    {mensaje && (
                        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-center gap-3 shadow-sm">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" /> 
                            <span className="font-medium">{mensaje}</span>
                        </div>
                    )}
                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-3 shadow-sm">
                            <AlertTriangle className="w-6 h-6 text-red-500" /> 
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Nombre del Curso</label>
                            <input
                                type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                                className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-700 placeholder:text-slate-400 shadow-sm"
                                placeholder="Ej. Seguridad Operacional y Factores Humanos"
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Horas Totales</label>
                                <input
                                    type="number" min="1" value={horas} onChange={(e) => setHoras(e.target.value)}
                                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-700 placeholder:text-slate-400 shadow-sm"
                                    placeholder="Ej. 20"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Instructor</label>
                                <select 
                                    value={instructor} onChange={(e) => setInstructor(e.target.value)}
                                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-700 shadow-sm appearance-none cursor-pointer"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                                >
                                    <option value="" disabled>Seleccione un instructor...</option>
                                    {[...(data.instructores || [])].sort((a, b) => a.nombre.localeCompare(b.nombre)).map(inst => <option key={inst.id} value={inst.nombre}>{inst.nombre}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Modalidad</label>
                                <select 
                                    value={modalidad} onChange={(e) => setModalidad(e.target.value)}
                                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-700 shadow-sm"
                                >
                                    <option value="Presencial">Presencial</option>
                                    <option value="Online">Online</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="pt-4 flex gap-4">
                            <button type="submit" disabled={!data.instructores || data.instructores.length === 0} className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-400 text-white p-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 active:scale-[0.98]">
                                {editingId ? 'Actualizar Curso' : 'Registrar Curso'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={() => { setEditingId(null); setNombre(''); setHoras(''); setInstructor(''); setModalidad('Presencial'); }} className="px-6 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl font-bold transition-colors">
                                    Cancelar
                                </button>
                            )}
                        </div>
                        {(!data.instructores || data.instructores.length === 0) && <p className="text-sm text-amber-600 text-center mt-3 font-medium flex items-center justify-center gap-2"><AlertTriangle className="w-4 h-4" /> Debe registrar al menos un instructor primero.</p>}
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Cursos Registrados</h3>
                            <span className="bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-sm font-bold">
                                {data.cursos.length} total
                            </span>
                        </div>
                        
                        {data.cursos.length === 0 ? (
                            <div className="text-center py-10 bg-slate-50/80 rounded-3xl border border-slate-100 border-dashed">
                                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium">No hay cursos registrados en el catálogo.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                {[...(data.cursos || [])].sort((a, b) => a.nombre.localeCompare(b.nombre)).map(c => (
                                    <div key={c.id} className="group flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-800 block">{c.nombre}</span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${c.modalidad === 'Online' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {c.modalidad || 'Presencial'}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium text-slate-500">{c.horasTotales} hrs • Instructor: <span className="text-slate-700">{c.instructor}</span></span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleEdit(c)}
                                                className="p-2.5 text-sky-600 hover:bg-sky-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                                                title="Editar Curso"
                                            >
                                                <Edit3 className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(c)}
                                                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                                                title="Eliminar Curso"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function FormEmpresa({ data, setData, addLog, goBack }) {
    const [nombre, setNombre] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nombre.trim()) { setError('El nombre de la empresa es obligatorio.'); return; }
        
        if (editingId) {
            const isDuplicate = data.empresas.some(emp => emp.id !== editingId && emp.nombre.toLowerCase() === nombre.trim().toLowerCase());
            if (isDuplicate) { setError('Esta empresa ya existe.'); return; }
            setData({ ...data, empresas: data.empresas.map(emp => emp.id === editingId ? { ...emp, nombre: nombre.trim() } : emp) });
            addLog('Empresas', `Actualizó la empresa a "${nombre.trim()}"`);
            setMensaje('Empresa actualizada con éxito.');
            setEditingId(null);
        } else {
            if (data.empresas.some(emp => emp.nombre.toLowerCase() === nombre.trim().toLowerCase())) { setError('Esta empresa ya está registrada.'); return; }
            const nuevaEmpresa = { id: Date.now().toString(), nombre: nombre.trim(), alumnos: [] };
            setData({ ...data, empresas: [...data.empresas, nuevaEmpresa] });
            addLog('Empresas', `Registró la empresa "${nuevaEmpresa.nombre}"`);
            setMensaje('Empresa registrada con éxito.');
        }
        setError(''); setNombre(''); setTimeout(() => setMensaje(''), 3000);
    };

    const handleEdit = (emp) => { setEditingId(emp.id); setNombre(emp.nombre); window.scrollTo({top:0, behavior:'smooth'}); };
    const handleDelete = (empresa) => {
        setData({ ...data, empresas: data.empresas.filter(e => e.id !== empresa.id), alumnos: data.alumnos.filter(a => a.empresaId !== empresa.id) });
        addLog('Empresas', `Eliminó la empresa "${empresa.nombre}" y a sus alumnos asociados`);
    };

    return (
        <div className="relative min-h-[calc(100vh-5rem)] -m-4 md:-m-8 lg:-m-10 p-4 md:p-8 lg:p-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-cover bg-center -z-10 filter brightness-[0.75]" style={{ backgroundImage: `url('/PC-12 WALLPAPER.jfif')` }}></div>
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] -z-10"></div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl w-full mx-auto">
                <div className="bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-2xl shadow-slate-900/30 border border-white/80">
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={goBack} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors shadow-sm" title="Página anterior">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="p-4 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl shadow-lg shadow-sky-500/30 text-white">
                            <Building2 className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{editingId ? 'Editar Empresa' : 'Alta de Empresa'}</h2>
                            <p className="text-slate-500 mt-1">Gestión de aerolíneas y organizaciones contratantes</p>
                        </div>
                    </div>
                    
                    {mensaje && <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-center gap-3 shadow-sm"><CheckCircle2 className="w-6 h-6 text-emerald-500" /> <span className="font-medium">{mensaje}</span></div>}
                    {error && <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-3 shadow-sm"><AlertTriangle className="w-6 h-6 text-red-500" /> <span className="font-medium">{error}</span></div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Razón Social / Nombre Comercial</label>
                            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all outline-none text-slate-700 placeholder:text-slate-400 shadow-sm" placeholder="Ej. Aerolíneas de México S.A. de C.V." />
                        </div>
                        <div className="pt-4 flex gap-4">
                            <button type="submit" className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white p-4 rounded-2xl font-bold text-lg shadow-lg shadow-sky-500/30 transition-all hover:-translate-y-0.5 active:scale-[0.98]">
                                {editingId ? 'Actualizar Empresa' : 'Registrar Empresa'}
                            </button>
                            {editingId && <button type="button" onClick={()=>{setEditingId(null); setNombre('');}} className="px-6 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl font-bold transition-colors">Cancelar</button>}
                        </div>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Directorio de Empresas</h3>
                            <span className="bg-sky-100 text-sky-700 py-1 px-3 rounded-full text-sm font-bold">{data.empresas.length} total</span>
                        </div>
                        
                        {data.empresas.length === 0 ? (
                            <div className="text-center py-10 bg-slate-50/80 rounded-3xl border border-slate-100 border-dashed">
                                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium">Aún no hay empresas en el sistema.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-1">
                                {[...(data.empresas || [])].sort((a, b) => a.nombre.localeCompare(b.nombre)).map(emp => (
                                    <div key={emp.id} className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-sky-300 hover:shadow-md transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 font-bold text-lg">{emp.nombre.charAt(0).toUpperCase()}</div>
                                            <span className="font-bold text-slate-700 truncate max-w-[150px]" title={emp.nombre}>{emp.nombre}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleEdit(emp)} className="p-2 text-sky-600 hover:bg-sky-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"><Edit3 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(emp)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function FormAlumno({ data, setData, addLog, goBack }) {
    const [nombre, setNombre] = useState('');
    const [empresaId, setEmpresaId] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [expandedEmpresas, setExpandedEmpresas] = useState({});
    const [editingId, setEditingId] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nombre.trim() || !empresaId) { setError('Todos los campos son obligatorios.'); return; }
        
        if (editingId) {
            const alToEdit = data.alumnos.find(a => a.id === editingId);
            const nuevasEmpresas = data.empresas.map(emp => {
                let e = { ...emp };
                if (e.id === alToEdit.empresaId) e.alumnos = e.alumnos.filter(a => a.id !== editingId);
                if (e.id === empresaId) e.alumnos = [...(e.alumnos||[]), {id: editingId, nombre: nombre.trim(), empresaId}];
                return e;
            });
            setData({ ...data, alumnos: data.alumnos.map(a => a.id === editingId ? { ...a, nombre: nombre.trim(), empresaId } : a), empresas: nuevasEmpresas });
            addLog('Alumnos', `Actualizó información del alumno "${nombre.trim()}"`);
            setMensaje('Alumno actualizado con éxito.'); setEditingId(null);
        } else {
            const empresa = data.empresas.find(e => e.id === empresaId);
            const nuevoAlumno = { id: Date.now().toString(), nombre: nombre.trim(), empresaId };
            const nuevasEmpresas = data.empresas.map(emp => emp.id === empresaId ? { ...emp, alumnos: [...(emp.alumnos || []), nuevoAlumno] } : emp);
            setData({ ...data, alumnos: [...data.alumnos, nuevoAlumno], empresas: nuevasEmpresas });
            addLog('Alumnos', `Inscribió al alumno "${nuevoAlumno.nombre}" en la empresa ${empresa.nombre}`);
            setMensaje('Alumno registrado con éxito.');
            setExpandedEmpresas({...expandedEmpresas, [empresaId]: true});
        }
        setError(''); setNombre(''); setEmpresaId(''); setTimeout(() => setMensaje(''), 3000);
    };

    const handleEdit = (al) => { setEditingId(al.id); setNombre(al.nombre); setEmpresaId(al.empresaId); window.scrollTo({top:0, behavior:'smooth'}); };
    const handleDelete = (alumnoId) => {
        const alumno = data.alumnos.find(a => a.id === alumnoId); if (!alumno) return;
        const nuevasEmpresas = data.empresas.map(emp => emp.id === alumno.empresaId ? { ...emp, alumnos: emp.alumnos.filter(a => a.id !== alumnoId) } : emp);
        setData({ ...data, alumnos: data.alumnos.filter(a => a.id !== alumnoId), empresas: nuevasEmpresas });
        addLog('Alumnos', `Dio de baja al alumno "${alumno.nombre}"`);
    };
    const toggleEmpresa = (id) => setExpandedEmpresas(prev => ({ ...prev, [id]: !prev[id] }));
    const empresasConAlumnos = data.empresas.filter(emp => emp.alumnos && emp.alumnos.length > 0);

    return (
        <div className="relative min-h-[calc(100vh-5rem)] -m-4 md:-m-8 lg:-m-10 p-4 md:p-8 lg:p-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-cover bg-center -z-10 filter brightness-[0.75]" style={{ backgroundImage: `url('/A320 WALLPAPER.jpg')` }}></div>
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] -z-10"></div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl w-full mx-auto">
                <div className="bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-2xl shadow-slate-900/30 border border-white/85">
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={goBack} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors shadow-sm" title="Página anterior">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/30 text-white">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{editingId ? 'Editar Alumno' : 'Alta de Alumno'}</h2>
                            <p className="text-slate-500 mt-1">Inscripción de personal técnico y tripulantes</p>
                        </div>
                    </div>
                    
                    {mensaje && <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-center gap-3 shadow-sm"><CheckCircle2 className="w-6 h-6 text-emerald-500" /> <span className="font-medium">{mensaje}</span></div>}
                    {error && <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-3 shadow-sm"><AlertTriangle className="w-6 h-6 text-red-500" /> <span className="font-medium">{error}</span></div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Nombre Completo del Alumno</label>
                            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-slate-700 placeholder:text-slate-400 shadow-sm" placeholder="Ej. Ing. Roberto Mendoza" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Organización / Empresa</label>
                            <select value={empresaId} onChange={(e) => setEmpresaId(e.target.value)} className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-slate-700 appearance-none cursor-pointer shadow-sm" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}>
                                <option value="" disabled>Seleccione la empresa a la que pertenece el alumno...</option>
                                {[...(data.empresas || [])].sort((a, b) => a.nombre.localeCompare(b.nombre)).map(emp => <option key={emp.id} value={emp.id}>{emp.nombre}</option>)}
                            </select>
                        </div>
                        
                        <div className="pt-4 flex gap-4">
                            <button type="submit" disabled={data.empresas.length === 0} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-400 text-white p-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 active:scale-[0.98]">
                                {editingId ? 'Actualizar Alumno' : 'Registrar Alumno'}
                            </button>
                            {editingId && <button type="button" onClick={()=>{setEditingId(null); setNombre(''); setEmpresaId('');}} className="px-6 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl font-bold transition-colors">Cancelar</button>}
                        </div>
                        {data.empresas.length === 0 && <p className="text-sm text-amber-600 text-center mt-3 font-medium flex items-center justify-center gap-2"><AlertTriangle className="w-4 h-4" /> Debe registrar al menos una empresa primero.</p>}
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Personal Registrado</h3>
                            <span className="bg-emerald-100 text-emerald-700 py-1 px-3 rounded-full text-sm font-bold">{data.alumnos.length} total</span>
                        </div>
                        
                        {empresasConAlumnos.length === 0 ? (
                            <div className="text-center py-10 bg-slate-50/80 rounded-3xl border border-slate-100 border-dashed">
                                <UserPlus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium">Aún no hay alumnos agrupados por empresa.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                                {[...empresasConAlumnos].sort((a, b) => a.nombre.localeCompare(b.nombre)).map(emp => (
                                    <div key={emp.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                                        <button onClick={() => toggleEmpresa(emp.id)} className="w-full flex items-center justify-between p-5 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-200/50 flex items-center justify-center text-slate-500"><Building2 className="w-5 h-5" /></div>
                                                <div className="text-left">
                                                    <span className="font-bold text-slate-800 block">{emp.nombre}</span>
                                                    <span className="text-xs font-semibold text-emerald-600 tracking-wide uppercase">{emp.alumnos.length} Tripulantes</span>
                                                </div>
                                            </div>
                                            <div className={`p-2 rounded-full bg-white shadow-sm border border-slate-100 transition-transform duration-300 ${expandedEmpresas[emp.id] ? 'rotate-180' : ''}`}><ChevronDown className="w-5 h-5 text-slate-400" /></div>
                                        </button>
                                        
                                        {expandedEmpresas[emp.id] && (
                                            <div className="p-2 bg-white space-y-1 border-t border-slate-100">
                                                {[...(emp.alumnos || [])].sort((a, b) => a.nombre.localeCompare(b.nombre)).map(al => (
                                                    <div key={al.id} className="group flex items-center justify-between p-3 px-4 rounded-xl hover:bg-slate-50 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                                            <span className="font-medium text-slate-700">{al.nombre}</span>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <button onClick={() => handleEdit(al)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Edit3 className="w-4 h-4" /></button>
                                                            <button onClick={() => handleDelete(al.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function FormAusencia({ data, setData, addLog, goBack }) {
    const [instructor, setInstructor] = useState('');
    const [causa, setCausa] = useState('Vacaciones');
    const [otroMotivo, setOtroMotivo] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!instructor || !fechaInicio || !fechaFin) return setError('Llene los campos obligatorios.');
        if (causa === 'Otro' && !otroMotivo.trim()) return setError('Especifique el motivo de la ausencia.');
        if (new Date(fechaInicio) > new Date(fechaFin)) return setError('Fechas inválidas.');

        const nuevaAusencia = { id: editingId || Date.now().toString(), instructor: instructor, causa, otroMotivo: causa === 'Otro' ? otroMotivo.trim() : '', fechaInicio, fechaFin };

        if (editingId) {
            setData({ ...data, ausencias: (data.ausencias || []).map(a => a.id === editingId ? nuevaAusencia : a) });
            addLog('Ausencias', `Actualizó ausencia de ${instructor}`);
            setMensaje('Ausencia actualizada.'); setEditingId(null);
        } else {
            setData({ ...data, ausencias: [...(data.ausencias || []), nuevaAusencia] });
            addLog('Ausencias', `Registró ausencia de ${instructor} (${causa})`);
            setMensaje('Ausencia registrada.');
        }
        setError(''); setInstructor(''); setCausa('Vacaciones'); setOtroMotivo(''); setFechaInicio(''); setFechaFin(''); setTimeout(() => setMensaje(''), 3000);
    };

    const handleDelete = (id) => { setData({ ...data, ausencias: data.ausencias.filter(a => a.id !== id) }); addLog('Ausencias', `Eliminó registro de ausencia`); };
    const handleEdit = (a) => { setEditingId(a.id); setInstructor(a.instructor); setCausa(a.causa); setOtroMotivo(a.otroMotivo || ''); setFechaInicio(a.fechaInicio); setFechaFin(a.fechaFin); window.scrollTo({ top: 0, behavior: 'smooth' }); };

    const instructoresUnicos = [...new Set((data.instructores || []).map(i => i.nombre))].sort((a, b) => a.localeCompare(b));

    return (
        <div className="relative min-h-[calc(100vh-5rem)] -m-4 md:-m-8 lg:-m-10 p-4 md:p-8 lg:p-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-cover bg-center -z-10 filter brightness-[0.75]" style={{ backgroundImage: `url('/A320 WALLPAPER.jpg')` }}></div>
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] -z-10"></div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl w-full mx-auto">
                <div className="bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-2xl shadow-slate-900/30 border border-white/80">
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={goBack} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors shadow-sm" title="Página anterior">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="p-4 bg-rose-500/10 rounded-2xl text-rose-500 border border-rose-200">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{editingId ? 'Editar Ausencia' : 'Reportar Ausencia'}</h2>
                            <p className="text-slate-500 mt-1">Bloquea fechas para evitar programación de instructores</p>
                        </div>
                    </div>

                    {mensaje && <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-center gap-3"><CheckCircle2 className="w-6 h-6" /> <span className="font-medium">{mensaje}</span></div>}
                    {error && <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-3"><AlertTriangle className="w-6 h-6" /> <span className="font-medium">{error}</span></div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Seleccionar Instructor</label>
                                <select value={instructor} onChange={e => setInstructor(e.target.value)} className="w-full p-4 bg-white border rounded-2xl outline-none shadow-sm appearance-none cursor-pointer" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}>
                                    <option value="" disabled>Elija un instructor...</option>
                                    {instructoresUnicos.map(i => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Causa de la Ausencia</label>
                                <select value={causa} onChange={e => setCausa(e.target.value)} className="w-full p-4 bg-white border rounded-2xl outline-none shadow-sm appearance-none cursor-pointer" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}>
                                    <option value="Está en curso">Está en curso</option>
                                    <option value="Vacaciones">Vacaciones</option>
                                    <option value="Otro">Otro motivo...</option>
                                </select>
                            </div>
                            {causa === 'Otro' && (
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Especifique el motivo</label>
                                    <input type="text" value={otroMotivo} onChange={e => setOtroMotivo(e.target.value)} className="w-full p-4 bg-white border rounded-2xl outline-none shadow-sm" placeholder="Ej. Permiso médico" />
                                </div>
                            )}
                            <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700 ml-1">Fecha de Inicio</label><input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className="w-full p-4 bg-white border rounded-2xl outline-none shadow-sm" /></div>
                            <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700 ml-1">Fecha de Término</label><input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} className="w-full p-4 bg-white border rounded-2xl outline-none shadow-sm" /></div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button type="submit" className="flex-1 bg-rose-600 hover:bg-rose-700 text-white p-4 rounded-2xl font-bold shadow-lg transition-all">{editingId ? 'Actualizar Ausencia' : 'Bloquear Fechas'}</button>
                            {editingId && <button type="button" onClick={() => { setEditingId(null); setInstructor(''); setCausa('Vacaciones'); setFechaInicio(''); setFechaFin(''); }} className="px-6 bg-slate-200 text-slate-700 rounded-2xl font-bold">Cancelar</button>}
                        </div>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Ausencias Registradas</h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                            {[...(data.ausencias || [])].sort((a, b) => a.instructor.localeCompare(b.instructor)).map(a => (
                                <div key={a.id} className="flex justify-between items-center p-4 bg-white border rounded-2xl hover:border-rose-300 transition-all group">
                                    <div>
                                        <p className="font-bold text-slate-800">{a.instructor} <span className="text-xs font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded ml-2">{a.causa}</span></p>
                                        <p className="text-sm text-slate-500 mt-1">{formatDateStr(a.fechaInicio)} al {formatDateStr(a.fechaFin)} {a.otroMotivo && `(${a.otroMotivo})`}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(a)} className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg opacity-0 group-hover:opacity-100"><Edit3 className="w-5 h-5" /></button>
                                        <button onClick={() => handleDelete(a.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function GanttBuilder({ data, setData, addLog, goBack }) {
    const [activeDiagramId, setActiveDiagramId] = useState(null);
    const [step, setStep] = useState('build'); 
    const [viewMode, setViewMode] = useState('manual'); 
    
    const [formGantt, setFormGantt] = useState({ cursoId: '', fechaInicio: '', fechaFin: '' });
    const [empresaCurrent, setEmpresaCurrent] = useState('');
    const [alumnoCurrent, setAlumnoCurrent] = useState('');
    const [alumnosSeleccionados, setAlumnosSeleccionados] = useState([]);
    
    const [autoMes, setAutoMes] = useState('');
    const [autoCursoId, setAutoCursoId] = useState('');
    const [autoEmpresaId, setAutoEmpresaId] = useState('');
    const [autoAlumnoId, setAutoAlumnoId] = useState('');
    const [autoAlumnosCurrent, setAutoAlumnosCurrent] = useState([]);
    const [autoBatch, setAutoBatch] = useState([]);
    const [propuestaIA, setPropuestaIA] = useState([]);

    const [alerta, setAlerta] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [confirmClear, setConfirmClear] = useState(false);

    const activeDiagram = (data.diagramas || []).find(d => d.id === activeDiagramId);
    const programacionActual = activeDiagram?.programacion || [];
    const allProgramacion = (data.diagramas || []).flatMap(d => d.programacion || []);

    const updateProg = (newProgArray) => {
        let nuevoNombre = activeDiagram?.nombre || 'NUEVO DIAGRAMA';
        
        if (newProgArray.length > 0) {
            // Analiza automáticamente el curso que empieza primero para nombrar el diagrama
            const minTime = Math.min(...newProgArray.map(p => new Date(p.fechaInicio + 'T00:00:00').getTime()));
            const minDate = new Date(minTime);
            const mes = minDate.toLocaleString('es-ES', { month: 'long', timeZone: 'UTC' }).toUpperCase();
            const year = minDate.getUTCFullYear();
            nuevoNombre = `CURSOS ${mes} ${year}`;
        }

        setData(prev => ({
            ...prev,
            diagramas: (prev.diagramas || []).map(d => d.id === activeDiagramId ? { ...d, nombre: nuevoNombre, programacion: newProgArray } : d)
        }));
    };

    const checkOverlaps = (fechaInicio, fechaFin, cursoAct, alumnosIds, ignoreProgId = null) => {
        const fi = new Date(fechaInicio + 'T00:00:00');
        const ff = new Date(fechaFin + 'T00:00:00');
        const fiTime = fi.getTime();
        const ffTime = ff.getTime();
        
        const isOnlineAct = cursoAct.modalidad === 'Online';
        
        let daysToTest = [];
        let curr = new Date(fi);
        const end = new Date(ff);
        while(curr <= end) {
            if(curr.getDay() !== 0 && !getMexicanHoliday(curr)) {
                daysToTest.push(curr.getTime());
            }
            curr.setDate(curr.getDate() + 1);
        }

        if (daysToTest.length === 0) {
            return "El periodo seleccionado solo abarca días de descanso (Domingos o Festivos). Seleccione al menos un día hábil.";
        }

        for (const aus of (data.ausencias || [])) {
            if (aus.instructor === cursoAct.instructor) {
                const aFi = new Date(aus.fechaInicio + 'T00:00:00').getTime();
                const aFf = new Date(aus.fechaFin + 'T00:00:00').getTime();
                
                let chocaAusencia = false;
                for (let t of daysToTest) {
                    if (t >= aFi && t <= aFf) {
                        chocaAusencia = true;
                        break;
                    }
                }
                
                if (chocaAusencia) {
                    return `El instructor ${cursoAct.instructor} tiene un registro de ausencia (${aus.causa}) cruzando los días hábiles de este curso.`;
                }
            }
        }

        for (const prog of allProgramacion) {
            if (ignoreProgId && prog.id === ignoreProgId) continue;
            
            const pFi = new Date(prog.fechaInicio + 'T00:00:00').getTime();
            const pFf = new Date(prog.fechaFin + 'T00:00:00').getTime();
            const isOnlineProg = prog.curso.modalidad === 'Online';

            if ((fiTime >= pFi && fiTime <= pFf) || (ffTime >= pFi && ffTime <= pFf) || (fiTime <= pFi && ffTime >= pFf) || (pFi >= fiTime && pFf <= ffTime)) {
                
                let overlapDays = 0;
                for(let t of daysToTest) {
                    if (t >= pFi && t <= pFf) overlapDays++;
                }

                if (overlapDays > 0) {
                    if (prog.curso.instructor === cursoAct.instructor) {
                        let totalPres = (isOnlineAct ? 0 : 8) + (isOnlineProg ? 0 : 8);
                        let totalOnl = (isOnlineAct ? 1 : 0) + (isOnlineProg ? 1 : 0);
                        if (totalPres > 8 || (totalPres + totalOnl) > 9) {
                            return `El instructor ${cursoAct.instructor} superaría el límite de horas o choca en Presencial con "${prog.curso.nombre}".`;
                        }
                    }
                    for (const aId of alumnosIds) {
                        if (prog.alumnos.some(pa => pa.id === aId)) {
                            let totalPres = (isOnlineAct ? 0 : 8) + (isOnlineProg ? 0 : 8);
                            let totalOnl = (isOnlineAct ? 1 : 0) + (isOnlineProg ? 1 : 0);
                            if (totalPres > 8 || (totalPres + totalOnl) > 9) {
                                const alumno = data.alumnos.find(a => a.id === aId);
                                return `El alumno ${alumno?.nombre || 'seleccionado'} superaría las horas permitidas o choca en Presencial con "${prog.curso.nombre}".`;
                            }
                        }
                    }
                }
            }
        }
        return null;
    };

    const addAlumno = () => {
        if (!alumnoCurrent) return;
        if (alumnosSeleccionados.find(a => a.id === alumnoCurrent)) return;
        const alumno = data.alumnos.find(a => a.id === alumnoCurrent);
        const empresa = data.empresas.find(e => e.id === alumno.empresaId);
        setAlumnosSeleccionados([...alumnosSeleccionados, { ...alumno, empresaNombre: empresa.nombre }]);
        setAlumnoCurrent('');
    };
    const removeAlumno = (id) => setAlumnosSeleccionados(alumnosSeleccionados.filter(a => a.id !== id));

    const handleGuardarProgramacion = () => {
        if (!formGantt.cursoId || !formGantt.fechaInicio || !formGantt.fechaFin) return setAlerta({ tipo: 'error', texto: 'Llene todos los campos.' });
        if (new Date(formGantt.fechaInicio) > new Date(formGantt.fechaFin)) return setAlerta({ tipo: 'error', texto: 'Fechas inválidas.' });
        if (alumnosSeleccionados.length === 0) return setAlerta({ tipo: 'error', texto: 'Añada alumnos.' });

        const curso = data.cursos.find(c => c.id === formGantt.cursoId);
        const error = checkOverlaps(formGantt.fechaInicio, formGantt.fechaFin, curso, alumnosSeleccionados.map(a => a.id), editingId);
        if (error) { setAlerta({ tipo: 'error', texto: error }); return; }

        const empresasUnicas = [...new Set(alumnosSeleccionados.map(a => a.empresaNombre))];
        const empresaAsignada = empresasUnicas.length > 1 ? { nombre: 'Múltiples Empresas' } : { nombre: empresasUnicas[0] };
        
        const payload = { id: editingId || Date.now().toString(), curso, empresa: empresaAsignada, fechaInicio: formGantt.fechaInicio, fechaFin: formGantt.fechaFin, alumnos: alumnosSeleccionados };

        if (editingId) {
            updateProg(programacionActual.map(p => p.id === editingId ? payload : p));
            setEditingId(null); setAlerta({ tipo: 'success', texto: 'Curso actualizado.' });
        } else {
            updateProg([...programacionActual, payload]);
            setAlerta({ tipo: 'success', texto: 'Curso programado.' });
        }
        setFormGantt({ cursoId: '', fechaInicio: '', fechaFin: '' }); setAlumnosSeleccionados([]); setTimeout(() => setAlerta(null), 3000);
    };

    const startEdit = (prog) => { setEditingId(prog.id); setFormGantt({ cursoId: prog.curso.id, fechaInicio: prog.fechaInicio, fechaFin: prog.fechaFin }); setAlumnosSeleccionados(prog.alumnos); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const cancelEdit = () => { setEditingId(null); setFormGantt({ cursoId: '', fechaInicio: '', fechaFin: '' }); setAlumnosSeleccionados([]); };
    
    const handleDeleteProgramacion = (prog) => { 
        updateProg(programacionActual.filter(p => p.id !== prog.id)); 
        addLog('Gantt', `Eliminó la programación del curso "${prog.curso.nombre}"`); 
    };

    const handleClearAll = () => {
        if (!confirmClear) {
            setConfirmClear(true);
            setTimeout(() => setConfirmClear(false), 4000); 
            return;
        }
        updateProg([]);
        addLog('Gantt', 'Vació por completo la programación del diagrama de Gantt');
        setConfirmClear(false);
        setAlerta({ tipo: 'success', texto: 'Se ha vaciado el diagrama por completo.' });
        setTimeout(() => setAlerta(null), 3000);
    };

    const handleAutoAddAlumno = () => {
        if(!autoAlumnoId) return;
        if(autoAlumnosCurrent.find(a => a.id === autoAlumnoId)) return;
        const al = data.alumnos.find(a => a.id === autoAlumnoId);
        const emp = data.empresas.find(e => e.id === al.empresaId);
        setAutoAlumnosCurrent([...autoAlumnosCurrent, {...al, empresaNombre: emp.nombre}]);
        setAutoAlumnoId('');
    };

    const handleAutoAddCourse = () => {
        if (!autoCursoId || autoAlumnosCurrent.length === 0) return setAlerta({ tipo: 'error', texto: 'Seleccione curso y alumnos para el lote.' });
        if (autoBatch.find(x => x.cursoId === autoCursoId)) return setAlerta({ tipo: 'error', texto: 'Curso ya está en el lote.' });
        setAutoBatch([...autoBatch, { cursoId: autoCursoId, alumnos: [...autoAlumnosCurrent] }]);
        setAutoCursoId(''); setAutoAlumnosCurrent([]);
        setAlerta({ tipo: 'success', texto: 'Añadido al lote automático.' }); setTimeout(()=>setAlerta(null),2000);
    };

    const handleAutoGenerate = () => {
        if (!autoMes || autoBatch.length === 0) return setAlerta({ tipo: 'error', texto: 'Seleccione mes y arme el lote.' });
        
        let currentDate = new Date(`${autoMes}-01T00:00:00`);
        let generatedProg = []; let errors = [];
        let dailyUsage = {};
        const getU = (d) => { if (!dailyUsage[d]) dailyUsage[d] = { inst: {}, stu: {} }; return dailyUsage[d]; };

        allProgramacion.forEach(prog => {
            const isO = prog.curso.modalidad === 'Online'; const hrs = isO ? 1 : 8;
            let c = new Date(prog.fechaInicio + 'T00:00:00'); let end = new Date(prog.fechaFin + 'T00:00:00');
            while(c <= end) {
                if(c.getDay() !== 0 && !getMexicanHoliday(c)) { 
                    const ds = c.toISOString().split('T')[0]; const u = getU(ds);
                    if(!u.inst[prog.curso.instructor]) u.inst[prog.curso.instructor] = {p:0, o:0, aus: false};
                    if(isO) u.inst[prog.curso.instructor].o += hrs; else u.inst[prog.curso.instructor].p += hrs;
                    prog.alumnos.forEach(al => {
                        if(!u.stu[al.id]) u.stu[al.id] = {p:0, o:0};
                        if(isO) u.stu[al.id].o += hrs; else u.stu[al.id].p += hrs;
                    });
                }
                c.setDate(c.getDate()+1);
            }
        });

        (data.ausencias || []).forEach(aus => {
            let c = new Date(aus.fechaInicio + 'T00:00:00'); let end = new Date(aus.fechaFin + 'T00:00:00');
            while(c <= end) {
                const ds = c.toISOString().split('T')[0]; const u = getU(ds);
                if(!u.inst[aus.instructor]) u.inst[aus.instructor] = {p:0, o:0, aus: true};
                else u.inst[aus.instructor].aus = true;
                c.setDate(c.getDate()+1);
            }
        });

        const sortedBatch = [...autoBatch].sort((a,b) => data.cursos.find(x=>x.id===a.cursoId).modalidad === 'Online' ? 1 : -1);

        sortedBatch.forEach(req => {
            const curso = data.cursos.find(c=>c.id===req.cursoId);
            const isO = curso.modalidad === 'Online'; const hrs = isO ? 1 : 8;
            const daysNeeded = isO ? 3 : Math.ceil(curso.horasTotales / 8);
            let placed = false; let tStart = new Date(currentDate);

            for(let attempt=0; attempt<60; attempt++) {
                if(tStart.getDay() === 0 || getMexicanHoliday(tStart)) { tStart.setDate(tStart.getDate()+1); continue; }
                let tDay = new Date(tStart); let valid = true; let rU = []; let dCount = 0;

                while(dCount < daysNeeded) {
                    if(tDay.getDay() === 0 || getMexicanHoliday(tDay)) { tDay.setDate(tDay.getDate()+1); continue; }
                    const ds = tDay.toISOString().split('T')[0]; const u = getU(ds);
                    
                    const inst = u.inst[curso.instructor] || {p:0, o:0, aus: false};
                    if(inst.aus || inst.p + (isO?0:hrs) > 8 || (inst.p + inst.o + hrs) > 9) { valid=false; break; }

                    for(let al of req.alumnos) {
                        const st = u.stu[al.id] || {p:0, o:0};
                        if(st.p + (isO?0:hrs) > 8 || (st.p + st.o + hrs) > 9) { valid=false; break; }
                    }
                    if(!valid) break;
                    rU.push(ds); tDay.setDate(tDay.getDate()+1); dCount++;
                }

                if(valid) {
                    tDay.setDate(tDay.getDate()-1);
                    rU.forEach(ds => {
                        const u = getU(ds);
                        if(!u.inst[curso.instructor]) u.inst[curso.instructor] = {p:0,o:0, aus:false};
                        if(isO) u.inst[curso.instructor].o += hrs; else u.inst[curso.instructor].p += hrs;
                        req.alumnos.forEach(al => {
                            if(!u.stu[al.id]) u.stu[al.id] = {p:0,o:0};
                            if(isO) u.stu[al.id].o += hrs; else u.stu[al.id].p += hrs;
                        });
                    });
                    const empU = [...new Set(req.alumnos.map(a=>a.empresaNombre))];
                    generatedProg.push({ id: 'auto_'+Date.now()+Math.random(), curso, empresa: {nombre: empU.length>1?'Múltiples':empU[0]}, fechaInicio: tStart.toISOString().split('T')[0], fechaFin: tDay.toISOString().split('T')[0], alumnos: req.alumnos });
                    placed = true; break;
                } else {
                    tStart.setDate(tStart.getDate()+1);
                }
            }
            if(!placed) errors.push(curso.nombre);
        });

        setPropuestaIA(generatedProg);
        if(errors.length > 0) setAlerta({tipo:'error', texto: `Imposible ubicar (choques/ausencias): ${errors.join(', ')}`});
        setStep('preview_auto');
    };

    const acceptAuto = () => {
        updateProg([...programacionActual, ...propuestaIA]);
        setAutoBatch([]);
        setStep('view');
        addLog('Gantt', 'Guardó programación automática IA');
    };

    const generarListaAlumnosPDF = async (prog) => {
        addLog('Documentos', `Generó la lista de asistencia en PDF para "${prog.curso.nombre}"`);
        try {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js');

            const { jsPDF } = window.jspdf; 
            if (!jsPDF) throw new Error("jsPDF no se cargó correctamente");
            
            const doc = new jsPDF();
            
            doc.setFontSize(22); doc.setTextColor(15, 23, 42); 
            doc.text("Centro de Adiestramiento L68", 14, 20);
            
            doc.setFontSize(14); doc.setTextColor(71, 85, 105); 
            doc.text("Lista de Asistencia a Curso", 14, 30);
            
            doc.setFontSize(11); doc.setTextColor(30, 41, 59); 
            doc.text(`Curso: ${prog.curso.nombre || 'N/A'}`, 14, 45);
            doc.text(`Instructor: ${prog.curso.instructor || 'N/A'}`, 14, 52);
            doc.text(`Horas Totales: ${prog.curso.horasTotales || 0} hrs`, 14, 59);
            doc.text(`Periodo: Del ${formatDateStr(prog.fechaInicio)} al ${formatDateStr(prog.fechaFin)}`, 14, 66);
            doc.text(`Cliente: ${prog.empresa?.nombre || 'N/A'}`, 14, 73);

            const tableColumn = ["#", "Nombre del Alumno", "Empresa Perteneciente"];
            const tableRows = (prog.alumnos || []).map((alumno, index) => [
                index + 1,
                alumno.nombre || 'N/A',
                alumno.empresaNombre || 'N/A'
            ]);

            if (typeof doc.autoTable !== 'function') {
                throw new Error("jsPDF AutoTable no se inicializó correctamente.");
            }

            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 85,
                theme: 'striped',
                headStyles: { fillColor: [15, 23, 42] }, 
                styles: { fontSize: 10, cellPadding: 5 }
            });

            doc.save(`Lista_Asistencia_${(prog.curso.nombre || 'Curso').replace(/\s+/g, '_')}.pdf`);
            
        } catch (error) {
            console.error("Error al generar PDF:", error);
            setAlerta({ tipo: 'error', texto: `Error al generar PDF: Revise su conexión o inténtelo de nuevo.` });
            setTimeout(() => setAlerta(null), 5000);
        }
    };

    if (!activeDiagramId) {
        const diagramas = data.diagramas || [];
        return (
            <div className="relative min-h-[calc(100vh-5rem)] -m-4 md:-m-8 lg:-m-10 p-4 md:p-8 lg:p-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-cover bg-center -z-10 filter brightness-[0.75]" style={{ backgroundImage: `url('/A320 WALLPAPER.jpg')` }}></div>
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] -z-10"></div>
                
                <div className="animate-in fade-in zoom-in-95 duration-300 max-w-5xl w-full mx-auto space-y-6">
                    <div className="bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-2xl border border-white/85 shadow-slate-900/30">
                        <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                            <button onClick={goBack} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors shadow-sm" title="Página anterior">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-400 rounded-2xl shadow-lg shadow-amber-500/30 text-white">
                                <LayoutDashboard className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Gestor de Diagramas</h2>
                                <p className="text-slate-500 mt-1">Crea un nuevo diagrama de Gantt o continúa con uno guardado</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <button 
                                onClick={() => {
                                    const newId = Date.now().toString();
                                    const currentDate = new Date();
                                    const mes = currentDate.toLocaleString('es-ES', { month: 'long' }).toUpperCase();
                                    const year = currentDate.getFullYear();
                                    
                                    const newDiag = { id: newId, nombre: `CURSOS ${mes} ${year}`, programacion: [] };
                                    setData(prev => ({ ...prev, diagramas: [...(prev.diagramas || []), newDiag] }));
                                    setActiveDiagramId(newId);
                                    setStep('build');
                                }}
                                className="group flex flex-col items-center justify-center p-8 bg-slate-50/50 border-2 border-dashed border-slate-300 rounded-[2rem] hover:bg-amber-50 hover:border-amber-400 transition-all duration-300 min-h-[200px]"
                            >
                                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:text-amber-500 text-slate-400">
                                    <PlusCircle className="w-8 h-8" />
                                </div>
                                <span className="font-bold text-slate-600 group-hover:text-amber-600">Crear Nuevo Diagrama</span>
                            </button>

                            {diagramas.sort((a,b) => b.id.localeCompare(a.id)).map(diag => (
                                <div key={diag.id} className="relative flex flex-col p-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-h-[200px]">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><CalendarDays className="w-6 h-6"/></div>
                                            <button 
                                                onClick={() => {
                                                    if(window.confirm(`¿Seguro que deseas eliminar el diagrama "${diag.nombre}"?`)) {
                                                        setData(prev => ({ ...prev, diagramas: prev.diagramas.filter(d => d.id !== diag.id) }));
                                                        addLog('Gantt', `Eliminó el diagrama "${diag.nombre}"`);
                                                    }
                                                }}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar Diagrama"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1">{diag.nombre}</h3>
                                        <p className="text-sm text-slate-500 font-medium">{diag.programacion.length} cursos programados</p>
                                    </div>
                                    <button 
                                        onClick={() => { setActiveDiagramId(diag.id); setStep('build'); }}
                                        className="w-full mt-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                                    >
                                        Abrir Diagrama <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'view') return <GanttVisualizer programacion={programacionActual} goBack={() => setStep('build')} generarListaAlumnosPDF={generarListaAlumnosPDF} addLog={addLog} />;
    
    if (step === 'preview_auto') return (
        <div className="relative min-h-screen">
            <GanttVisualizer programacion={[...programacionActual, ...propuestaIA]} goBack={() => setStep('build')} generarListaAlumnosPDF={generarListaAlumnosPDF} addLog={addLog} />
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-50 bg-slate-900/90 backdrop-blur-md p-4 rounded-3xl border border-slate-700 shadow-2xl">
                <button onClick={() => setStep('build')} className="px-6 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700">VOLVER / CANCELAR</button>
                <button onClick={acceptAuto} className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-lg hover:scale-105">✅ ACEPTAR Y GUARDAR</button>
            </div>
        </div>
    );

    return (
        <div className="relative min-h-[calc(100vh-5rem)] -m-4 md:-m-8 lg:-m-10 p-4 md:p-8 lg:p-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-cover bg-center -z-10 filter brightness-[0.75]" style={{ backgroundImage: `url('/A320 WALLPAPER.jpg')` }}></div>
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] -z-10"></div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl w-full mx-auto space-y-6">
                <div className={`bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-2xl border ${editingId ? 'border-amber-400 shadow-amber-500/20' : 'border-white/85 shadow-slate-900/30'}`}>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8 mb-8">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setActiveDiagramId(null)} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors shadow-sm" title="Volver a Diagramas">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className={`p-4 rounded-2xl shadow-lg text-white ${viewMode==='auto' ? 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-500/30' : 'bg-gradient-to-br from-amber-500 to-orange-400 shadow-amber-500/30'}`}>
                                {viewMode==='auto' ? <Wand2 className="w-8 h-8"/> : <CalendarDays className="w-8 h-8" />}
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                                    {activeDiagram?.nombre || 'Borrador'} {editingId && '- Editando'}
                                </h2>
                                <p className="text-slate-500 mt-1">{viewMode==='auto'?'Asignación automática IA':'Asignación manual'}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={()=>setViewMode(viewMode==='manual'?'auto':'manual')} className="px-5 py-2.5 rounded-xl font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-sm">
                                {viewMode==='manual' ? '✨ AUTOMÁTICO' : '✍️ MANUAL'}
                            </button>
                            <button onClick={() => setStep('view')} disabled={programacionActual.length === 0} className="group flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-slate-900/20 hover:-translate-y-1 active:scale-95">
                                VER GANTT
                                <span className="bg-amber-500 text-slate-900 px-2 py-0.5 rounded-lg text-sm group-disabled:bg-slate-300 group-disabled:text-slate-500">{programacionActual.length}</span>
                                <ChevronRight className="w-5 h-5 group-disabled:opacity-0" />
                            </button>
                        </div>
                    </div>

                    {alerta && <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 shadow-sm border ${alerta.tipo === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>{alerta.tipo === 'error' ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />} <span className="font-medium">{alerta.texto}</span></div>}

                    {viewMode === 'manual' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-sm">1</span> Definir Materia y Fechas</h3>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Curso a impartir</label>
                                    <select value={formGantt.cursoId} onChange={e => setFormGantt({...formGantt, cursoId: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none text-slate-700 appearance-none shadow-sm cursor-pointer" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}>
                                        <option value="" disabled>Seleccione un curso del catálogo...</option>
                                        {[...(data.cursos || [])].sort((a, b) => a.nombre.localeCompare(b.nombre)).map(c => <option key={c.id} value={c.id}>{c.modalidad==='Online'?'🟢':'🔵'} {c.nombre} ({c.horasTotales} hrs) - Inst. {c.instructor}</option>)}
                                    </select>
                                    {formGantt.cursoId && data.cursos.find(c=>c.id===formGantt.cursoId)?.modalidad === 'Online' && <p className="text-xs text-green-600 font-bold bg-green-50 p-2 rounded flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Curso Online: Vía Libre para empalmes habilitada.</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700 ml-1">Inicio</label><input type="date" value={formGantt.fechaInicio} onChange={e => setFormGantt({...formGantt, fechaInicio: e.target.value})} className="w-full p-4 bg-white border rounded-2xl outline-none" /></div>
                                    <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700 ml-1">Término</label><input type="date" value={formGantt.fechaFin} onChange={e => setFormGantt({...formGantt, fechaFin: e.target.value})} className="w-full p-4 bg-white border rounded-2xl outline-none" /></div>
                                </div>
                            </div>

                            <div className="space-y-6 bg-slate-50/80 p-6 rounded-[2rem] border border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-slate-500 text-sm shadow-sm border border-slate-200">2</span> Participantes</h3>
                                <select value={empresaCurrent} onChange={e => {setEmpresaCurrent(e.target.value); setAlumnoCurrent('');}} className="w-full p-4 bg-white border rounded-2xl outline-none mb-3"><option value="">Filtrar Empresa...</option>{[...(data.empresas || [])].sort((a, b) => a.nombre.localeCompare(b.nombre)).map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}</select>
                                <div className="flex gap-3">
                                    <select disabled={!empresaCurrent} value={alumnoCurrent} onChange={e => setAlumnoCurrent(e.target.value)} className="flex-1 p-4 bg-white border rounded-2xl outline-none"><option value="">Seleccione alumno...</option>{[...(data.alumnos || [])].filter(a => a.empresaId === empresaCurrent).sort((a, b) => a.nombre.localeCompare(b.nombre)).map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}</select>
                                    <button type="button" onClick={addAlumno} disabled={!alumnoCurrent} className="bg-slate-800 text-white p-4 rounded-2xl"><PlusCircle className="w-6 h-6" /></button>
                                </div>
                                {alumnosSeleccionados.length > 0 && (
                                    <ul className="bg-white border rounded-2xl max-h-40 overflow-y-auto divide-y mt-4">
                                        {[...alumnosSeleccionados].sort((a, b) => a.nombre.localeCompare(b.nombre)).map(a => (
                                            <li key={a.id} className="flex justify-between items-center p-3 px-4 text-sm group">
                                                <div><span className="font-bold block">{a.nombre}</span><span className="text-xs text-slate-400">{a.empresaNombre}</span></div>
                                                <button onClick={() => removeAlumno(a.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="md:col-span-2 pt-4 flex gap-4">
                                {editingId && <button onClick={cancelEdit} className="px-10 py-4 rounded-2xl bg-slate-200 text-slate-700 font-bold">CANCELAR</button>}
                                <button onClick={handleGuardarProgramacion} className="flex-1 text-white p-4 rounded-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg active:scale-95 flex items-center justify-center gap-2"><CalendarDays className="w-5 h-5"/> {editingId?'GUARDAR CAMBIOS':'AGENDAR CURSO'}</button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-purple-50/50 p-6 md:p-8 rounded-[2rem] border border-purple-100">
                            <div className="space-y-1.5 mb-8"><label className="text-sm font-semibold text-slate-700 ml-1">Mes Objetivo (Se buscarán días libres)</label><input type="month" value={autoMes} onChange={e=>setAutoMes(e.target.value)} className="w-full p-4 bg-white border border-purple-200 rounded-2xl shadow-sm outline-none" /></div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="space-y-6 bg-white p-6 rounded-3xl border border-purple-100">
                                    <h4 className="font-bold text-slate-700">1. Preparar Grupo (Lote)</h4>
                                    <select value={autoCursoId} onChange={e=>setAutoCursoId(e.target.value)} className="w-full p-4 bg-white border rounded-2xl outline-none"><option value="">Seleccione Curso...</option>{[...(data.cursos || [])].sort((a, b) => a.nombre.localeCompare(b.nombre)).map(c=><option key={c.id} value={c.id}>{c.modalidad==='Online'?'🟢':'🔵'} {c.nombre}</option>)}</select>
                                    <select value={autoEmpresaId} onChange={e=>{setAutoEmpresaId(e.target.value); setAutoAlumnoId('');}} className="w-full p-4 bg-white border rounded-2xl outline-none"><option value="">Filtrar Empresa...</option>{[...(data.empresas || [])].sort((a, b) => a.nombre.localeCompare(b.nombre)).map(e=><option key={e.id} value={e.id}>{e.nombre}</option>)}</select>
                                    <div className="flex gap-3">
                                        <select disabled={!autoEmpresaId} value={autoAlumnoId} onChange={e=>setAutoAlumnoId(e.target.value)} className="flex-1 p-4 bg-white border rounded-2xl outline-none"><option value="">Añadir alumno...</option>{[...(data.alumnos || [])].filter(a=>a.empresaId===autoEmpresaId).sort((a, b) => a.nombre.localeCompare(b.nombre)).map(a=><option key={a.id} value={a.id}>{a.nombre}</option>)}</select>
                                        <button onClick={handleAutoAddAlumno} className="bg-purple-500 text-white p-4 rounded-2xl"><PlusCircle className="w-6 h-6"/></button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">{[...autoAlumnosCurrent].sort((a, b) => a.nombre.localeCompare(b.nombre)).map(a=><span key={a.id} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold flex gap-2">{a.nombre} <button onClick={()=>setAutoAlumnosCurrent(autoAlumnosCurrent.filter(x=>x.id!==a.id))} className="text-red-500"><Trash2 className="w-3 h-3"/></button></span>)}</div>
                                    <button onClick={handleAutoAddCourse} className="w-full bg-slate-800 text-white p-4 rounded-2xl font-bold">AÑADIR CURSO AL LOTE</button>
                                </div>
                                
                                <div className="space-y-4">
                                    <h4 className="font-bold text-slate-700 mb-4">2. Lote para IA ({autoBatch.length})</h4>
                                    <div className="space-y-3">{[...autoBatch].sort((a, b) => { const cA = data.cursos.find(c=>c.id===a.cursoId)?.nombre || ''; const cB = data.cursos.find(c=>c.id===b.cursoId)?.nombre || ''; return cA.localeCompare(cB); }).map((req, i) => (
                                        <div key={i} className="p-4 bg-white border border-purple-200 rounded-xl flex justify-between items-center shadow-sm">
                                            <div><p className="font-bold text-sm text-slate-800">{data.cursos.find(c=>c.id===req.cursoId)?.nombre}</p><p className="text-xs text-purple-600 font-medium">{req.alumnos.length} alumnos</p></div>
                                            <div className="flex gap-2">
                                                <button onClick={()=>{ setAutoCursoId(req.cursoId); setAutoAlumnosCurrent(req.alumnos); setAutoBatch(autoBatch.filter(c=>c.cursoId!==req.cursoId)); }} className="text-sky-600 p-2"><Edit3 className="w-4 h-4"/></button>
                                                <button onClick={()=>setAutoBatch(autoBatch.filter(x=>x.cursoId!==req.cursoId))} className="text-red-400 p-2"><Trash2 className="w-4 h-4"/></button>
                                            </div>
                                        </div>
                                    ))}</div>
                                    <button onClick={handleAutoGenerate} disabled={autoBatch.length===0} className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"><Wand2 className="w-5 h-5"/> CALCULAR DIAGRAMA</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {viewMode === 'manual' && programacionActual.length > 0 && (
                        <div className="mt-10 bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-white/85">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <h3 className="font-extrabold text-xl text-slate-800 flex items-center gap-2">
                                    <FileText className="w-6 h-6 text-slate-400" /> Cursos Programados en este Diagrama
                                </h3>
                                <button
                                    onClick={handleClearAll}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${confirmClear ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30' : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'}`}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    {confirmClear ? '¿CONFIRMAR ELIMINACIÓN TOTAL?' : 'Vaciar Diagrama'}
                                </button>
                            </div>
                            <div className="overflow-hidden border border-slate-200 rounded-2xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-sm">
                                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                                            <tr>
                                                <th className="px-6 py-4">Materia / Curso</th>
                                                <th className="px-6 py-4">Cliente (Empresa)</th>
                                                <th className="px-6 py-4">Periodo (Inicio - Fin)</th>
                                                <th className="px-6 py-4">Asistencia</th>
                                                <th className="px-6 py-4 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {[...programacionActual].sort((a, b) => a.curso.nombre.localeCompare(b.curso.nombre)).map(p => (
                                                <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <span className="font-bold text-slate-800 block">{p.curso.nombre}</span>
                                                        <span className="text-xs text-slate-500 font-medium">Inst. {p.curso.instructor}</span>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-slate-700">
                                                        {p.empresa.nombre === 'Múltiples Empresas' ? (
                                                            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-md">{p.empresa.nombre}</span>
                                                        ) : (
                                                            p.empresa.nombre
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                                                        <span className="text-slate-800">{formatDateStr(p.fechaInicio)}</span> al <span className="text-slate-800">{formatDateStr(p.fechaFin)}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-lg text-xs">
                                                            {p.alumnos.length} pax
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.currentTarget.style.opacity = '0.5';
                                                                    generarListaAlumnosPDF(p).finally(() => { e.currentTarget.style.opacity = '1' });
                                                                }}
                                                                className="p-2 bg-slate-800 text-white hover:bg-slate-700 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold"
                                                                title="Descargar Lista de Alumnos"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </button>
                                                            <button 
                                                                onClick={() => startEdit(p)}
                                                                className="p-2 text-sky-600 hover:bg-sky-50 rounded-xl transition-colors inline-flex items-center justify-center"
                                                                title="Editar Programación"
                                                            >
                                                                <Edit3 className="w-5 h-5" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteProgramacion(p)}
                                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors inline-flex items-center justify-center"
                                                                title="Eliminar Programación"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function GanttVisualizer({ programacion, goBack, generarListaAlumnosPDF, addLog }) {
    const ganttRef = useRef(null);
    const [mesFiltro, setMesFiltro] = useState('Todos');
    const [instFiltro, setInstFiltro] = useState('Todos');
    const [showReporte, setShowReporte] = useState(false);

    const mesesDisponibles = ['Todos', ...new Set(programacion.map(p => {
        const d = new Date(p.fechaInicio + 'T00:00:00');
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }))].sort();

    const instDisponibles = ['Todos', ...new Set(programacion.map(p => p.curso.instructor))].sort();

    const programacionFiltrada = programacion.filter(p => {
        const matchMes = mesFiltro === 'Todos' || p.fechaInicio.startsWith(mesFiltro);
        const matchInst = instFiltro === 'Todos' || p.curso.instructor === instFiltro;
        return matchMes && matchInst;
    });

    const calcularFechasUnicas = () => {
        let minDate = new Date(); let maxDate = new Date();
        if (programacionFiltrada.length > 0) {
            minDate = new Date(Math.min(...programacionFiltrada.map(p => new Date(p.fechaInicio + 'T00:00:00').getTime())));
            maxDate = new Date(Math.max(...programacionFiltrada.map(p => new Date(p.fechaFin + 'T00:00:00').getTime())));
        }
        minDate.setDate(minDate.getDate() - 2); maxDate.setDate(maxDate.getDate() + 2);

        const dias = []; let currDate = new Date(minDate);
        while (currDate <= maxDate) { dias.push(new Date(currDate)); currDate.setDate(currDate.getDate() + 1); }

        const meses = [];
        dias.forEach(d => {
            const mesStr = d.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
            const mesFormat = mesStr.charAt(0).toUpperCase() + mesStr.slice(1);
            if (!meses.find(m => m.label === mesFormat)) meses.push({ label: mesFormat, colSpan: 1 });
            else meses[meses.length - 1].colSpan += 1;
        });

        return { minDate, maxDate, dias, meses };
    };

    const fechas = calcularFechasUnicas();

    const exportToImage = async () => {
        addLog('Documentos', `Exportó el diagrama de Gantt como Imagen PNG`);
        try {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
            const pdfButtons = document.querySelectorAll('.pdf-button'); 
            pdfButtons.forEach(btn => btn.style.display = 'none');
            
            const element = ganttRef.current;
            const parent = element.parentElement;
            
            const originalScrollLeft = parent.scrollLeft;
            const originalOverflow = parent.style.overflow;
            parent.style.overflow = 'visible';
            
            const canvas = await window.html2canvas(element, { 
                scale: 2, 
                backgroundColor: '#ffffff',
                width: element.scrollWidth,
                height: element.scrollHeight,
                windowWidth: element.scrollWidth
            });
            
            parent.style.overflow = originalOverflow;
            parent.scrollLeft = originalScrollLeft;
            pdfButtons.forEach(btn => btn.style.display = '');

            const url = canvas.toDataURL('image/png'); 
            const link = document.createElement('a');
            link.download = 'diagrama_gantt_l68.png'; 
            link.href = url; 
            link.click();
        } catch (error) { 
            alert('Hubo un error al exportar la imagen.'); 
        }
    };

    const exportToPDF = async () => {
        addLog('Documentos', `Exportó el diagrama de Gantt como Documento PDF`);
        try {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
            
            const pdfButtons = document.querySelectorAll('.pdf-button'); 
            pdfButtons.forEach(btn => btn.style.display = 'none');
            
            const element = ganttRef.current;
            const parent = element.parentElement;
            
            const originalScrollLeft = parent.scrollLeft;
            const originalOverflow = parent.style.overflow;
            parent.style.overflow = 'visible';
            
            const canvas = await window.html2canvas(element, { 
                scale: 2, 
                backgroundColor: '#ffffff',
                width: element.scrollWidth,
                height: element.scrollHeight,
                windowWidth: element.scrollWidth
            });
            
            parent.style.overflow = originalOverflow;
            parent.scrollLeft = originalScrollLeft;
            pdfButtons.forEach(btn => btn.style.display = '');

            const imgData = canvas.toDataURL('image/jpeg', 1.0); 
            const { jsPDF } = window.jspdf;
            
            const pdfWidth = canvas.width;
            const pdfHeight = canvas.height;
            const pdf = new jsPDF({ 
                orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait', 
                unit: 'px', 
                format: [pdfWidth, pdfHeight] 
            });
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight); 
            pdf.save('diagrama_gantt_l68.pdf');
        } catch (error) { 
            console.error(error);
            alert('Hubo un error al exportar el PDF.'); 
        }
    };

    const exportReporteGeneralPDF = async () => {
        addLog('Documentos', `Exportó el reporte general del Gantt a PDF`);
        try {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js');

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            doc.setFontSize(18); doc.setTextColor(15, 23, 42); 
            doc.text("Reporte General de Cursos Programados", 14, 20);
            
            doc.setFontSize(11); doc.setTextColor(71, 85, 105);
            doc.text(`Filtro actual - Instructor: ${instFiltro} | Mes: ${mesFiltro}`, 14, 28);
            doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 34);

            const tableColumn = ["Curso", "Cliente", "Instructor", "Periodo"];
            const tableRows = [...programacionFiltrada]
                .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio))
                .map(p => [
                    p.curso.nombre,
                    p.empresa.nombre,
                    p.curso.instructor,
                    `${formatDateStr(p.fechaInicio)} al ${formatDateStr(p.fechaFin)}`
                ]);

            if (typeof doc.autoTable !== 'function') {
                throw new Error("jsPDF AutoTable no se inicializó correctamente.");
            }

            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 40,
                theme: 'striped',
                headStyles: { fillColor: [15, 23, 42] }, 
                styles: { fontSize: 10, cellPadding: 5 }
            });

            doc.save(`Reporte_General_Gantt.pdf`);
            
        } catch (error) {
            console.error("Error al generar PDF:", error);
            alert('Hubo un error al generar el PDF del reporte.');
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-5rem)] -m-4 md:-m-8 lg:-m-10 p-4 md:p-8 lg:p-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-cover bg-center -z-10 filter brightness-[0.75]" style={{ backgroundImage: `url('/A320 WALLPAPER.jpg')` }}></div>
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] -z-10"></div>

            <div className="animate-in fade-in zoom-in-95 duration-300 max-w-full w-full mx-auto">
                <div className="bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-slate-900/30 border border-white">
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 mb-6 gap-6">
                        <div className="flex items-center gap-4">
                            <button onClick={goBack} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors shadow-sm" title="Página anterior"><ChevronLeft className="w-5 h-5" /></button>
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2"><CalendarDays className="w-7 h-7 text-amber-500" /> Visualizador de Gantt</h2>
                                <p className="text-sm text-slate-500 font-medium mt-1">Mapa de capacitación del diagrama actual</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3">
                            <button onClick={() => setShowReporte(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20">
                                <ClipboardList className="w-4 h-4 text-indigo-200" /> Ver Reporte General
                            </button>
                            
                            <div className="bg-slate-100 p-1.5 rounded-xl flex items-center shadow-inner border border-slate-200 ml-2">
                                <Filter className="w-4 h-4 text-slate-400 ml-2" />
                                <select value={instFiltro} onChange={e => setInstFiltro(e.target.value)} className="bg-transparent border-0 text-sm font-bold text-slate-700 outline-none p-2 cursor-pointer w-32">
                                    {instDisponibles.map(m => <option key={m} value={m}>{m === 'Todos' ? 'Instructores' : m}</option>)}
                                </select>
                            </div>
                            <div className="bg-slate-100 p-1.5 rounded-xl flex items-center shadow-inner border border-slate-200">
                                <Search className="w-4 h-4 text-slate-400 ml-2" />
                                <select value={mesFiltro} onChange={e => setMesFiltro(e.target.value)} className="bg-transparent border-0 text-sm font-bold text-slate-700 outline-none p-2 cursor-pointer w-32">
                                    {mesesDisponibles.map(m => <option key={m} value={m}>{m === 'Todos' ? 'Meses' : m}</option>)}
                                </select>
                            </div>
                            <button onClick={exportToImage} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-800/20"><ImageIcon className="w-4 h-4 text-amber-400" /> Exportar a Imagen</button>
                            <button onClick={exportToPDF} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-red-600/20"><Printer className="w-4 h-4 text-red-200" /> Exportar a PDF</button>
                        </div>
                    </div>

                    {programacionFiltrada.length === 0 ? (
                        <div className="text-center py-20 text-slate-500 font-medium bg-slate-50/50 rounded-2xl border border-slate-200">No hay cursos programados para las fechas seleccionadas.</div>
                    ) : (
                        <div className="p-2 overflow-x-auto rounded-2xl bg-slate-50/50 border border-slate-200 shadow-inner" style={{ minHeight: '400px' }}>
                            <div ref={ganttRef} className="inline-block min-w-full bg-white rounded-xl overflow-hidden" style={{ padding: '10px' }}>
                                
                                <div className="p-4 bg-slate-900 text-white flex justify-between items-center rounded-t-xl mb-1">
                                    <div className="flex items-center gap-3">
                                        <Plane className="w-6 h-6 text-amber-500" />
                                        <h3 className="text-lg font-bold tracking-widest uppercase">Centro de Adiestramiento L68 - Gantt</h3>
                                    </div>
                                    <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-full">Fecha: {new Date().toLocaleDateString()}</span>
                                </div>

                                <div className="flex border border-slate-200 bg-slate-100 rounded-t-lg mt-2">
                                    <div className="w-[340px] flex-shrink-0 border-r border-slate-200 p-3 font-bold text-slate-700 text-sm uppercase tracking-wider flex items-center justify-center bg-slate-200/50">Materia, Cliente y Lista</div>
                                    <div className="flex flex-1">
                                        {fechas.meses.map((mes, idx) => (
                                            <div key={idx} className="text-center font-extrabold text-sm text-slate-700 py-2 border-r border-slate-200 bg-slate-50" style={{ width: `${mes.colSpan * 40}px` }}>{mes.label}</div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex border-b border-x border-slate-200 bg-slate-50">
                                    <div className="w-[340px] flex-shrink-0 border-r border-slate-200 bg-slate-100"></div>
                                    <div className="flex flex-1">
                                        {fechas.dias.map((dia, idx) => {
                                            const festivo = getMexicanHoliday(dia);
                                            const isWeekendOrHoliday = dia.getDay() === 0 || festivo;
                                            return (
                                                <div key={idx} title={festivo || ''} className={`w-[40px] text-center text-xs py-1.5 font-bold border-r border-slate-200 ${isWeekendOrHoliday ? 'bg-rose-100/70 text-rose-500' : 'text-slate-600'}`}>{dia.getDate()}</div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="border-x border-b border-slate-200 rounded-b-lg overflow-hidden bg-white">
                                    {[...programacionFiltrada].sort((a, b) => a.curso.nombre.localeCompare(b.curso.nombre)).map((prog, i) => {
                                        const pInicio = new Date(`${prog.fechaInicio}T00:00:00`); const pFin = new Date(`${prog.fechaFin}T00:00:00`);
                                        pInicio.setHours(0,0,0,0); pFin.setHours(0,0,0,0);
                                        const msPerDay = 24 * 60 * 60 * 1000;
                                        const difInicio = Math.round((pInicio - fechas.minDate) / msPerDay);
                                        const duracion = Math.round((pFin - pInicio) / msPerDay) + 1;
                                        const isOnline = prog.curso.modalidad === 'Online';
                                        const isMultiMes = pInicio.getMonth() !== pFin.getMonth();
                                        
                                        return (
                                            <div key={prog.id} className={`flex group ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-amber-50/30 transition-colors border-b border-slate-100 last:border-0`}>
                                                <div className="w-[340px] flex-shrink-0 border-r border-slate-200 p-3 flex justify-between items-center bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                                    <div className="flex flex-col justify-center flex-1 pr-2 min-h-[44px] min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-extrabold text-sm text-slate-800 truncate leading-relaxed pb-0.5">
                                                                {prog.curso.nombre} 
                                                            </span>
                                                            {isMultiMes && (
                                                                <span className="text-[9px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded flex-shrink-0 border border-red-200">
                                                                    Multi-mes
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <span className={`text-[11px] font-semibold truncate leading-relaxed pb-0.5 pr-2 ${prog.empresa.nombre === 'Múltiples Empresas' ? 'text-indigo-600' : 'text-slate-500'}`}>
                                                                {prog.empresa.nombre}
                                                            </span>
                                                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded flex-shrink-0">
                                                                {prog.alumnos.length} pax
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {generarListaAlumnosPDF && (
                                                        <button 
                                                            onClick={(e) => {
                                                                e.currentTarget.style.opacity = '0.5';
                                                                generarListaAlumnosPDF(prog).finally(() => { e.currentTarget.style.opacity = '1' });
                                                            }}
                                                            className="pdf-button flex-shrink-0 bg-slate-900 hover:bg-slate-700 text-white p-2 rounded-lg flex items-center justify-center transition-all shadow-sm ml-2"
                                                            title="Ver Lista de Alumnos (PDF)"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex flex-1 relative min-h-[64px]">
                                                    {fechas.dias.map((dia, idx) => {
                                                        const isWeekendOrHoliday = dia.getDay() === 0 || getMexicanHoliday(dia);
                                                        return (
                                                            <div key={idx} className={`w-[40px] flex-shrink-0 border-r border-slate-100 ${isWeekendOrHoliday ? 'bg-rose-50/30 [background-image:repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(244,63,94,0.05)_2px,rgba(244,63,94,0.05)_4px)]' : ''}`} />
                                                        );
                                                    })}

                                                    <div 
                                                        className={`absolute top-2.5 bottom-2.5 rounded-lg shadow-md flex items-center px-3 overflow-hidden cursor-default transition-all z-20 border ${isOnline ? 'bg-gradient-to-r from-emerald-400 to-green-500 border-green-600/50' : 'bg-gradient-to-r from-sky-500 to-blue-600 border-sky-600/50'}`}
                                                        style={{ left: `${difInicio * 40}px`, width: `${duracion * 40}px` }}
                                                        title={`${prog.curso.nombre}\nDel: ${formatDateStr(prog.fechaInicio)}\nAl: ${formatDateStr(prog.fechaFin)}`}
                                                    >
                                                        <span className="text-white text-xs font-bold whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-sm flex items-center gap-1.5">
                                                            <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center"><UserPlus className="w-2.5 h-2.5" /></div>
                                                            Inst. {prog.curso.instructor}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-slate-500 justify-end items-center">
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gradient-to-r from-sky-500 to-blue-600 rounded border border-sky-600/50 shadow-sm"></div> Cursos Presenciales</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded border border-green-600/50 shadow-sm"></div> Cursos Online</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-rose-50/50 [background-image:repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(244,63,94,0.1)_2px,rgba(244,63,94,0.1)_4px)] rounded border border-rose-200"></div> Domingos / Festivos Oficiales</div>
                    </div>
                </div>
            </div>

            {/* Ventana Modal: Reporte General */}
            {showReporte && (
                <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                    <ClipboardList className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Reporte General de Gantt</h3>
                                    <p className="text-xs text-slate-500 font-medium">Resumen de cursos programados</p>
                                </div>
                            </div>
                            <button onClick={() => setShowReporte(false)} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                                    <tr>
                                        <th className="px-4 py-3 rounded-tl-lg">Materia / Curso</th>
                                        <th className="px-4 py-3 rounded-tr-lg">Periodo (Inicio - Fin)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {[...programacionFiltrada].sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)).map(p => (
                                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <span className="font-bold text-slate-800 block">{p.curso.nombre}</span>
                                                <span className="text-xs text-slate-500 font-medium">{p.empresa.nombre} • Inst. {p.curso.instructor}</span>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-slate-600">
                                                {formatDateStr(p.fechaInicio)} al {formatDateStr(p.fechaFin)}
                                            </td>
                                        </tr>
                                    ))}
                                    {programacionFiltrada.length === 0 && (
                                        <tr>
                                            <td colSpan="2" className="px-4 py-8 text-center text-slate-500 font-medium">No hay cursos programados bajo este filtro.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => setShowReporte(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors">
                                Cerrar
                            </button>
                            <button 
                                onClick={exportReporteGeneralPDF} 
                                disabled={programacionFiltrada.length === 0} 
                                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Printer className="w-4 h-4" /> Exportar a PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ReportesMensuales({ data, addLog, goBack }) {
    const [mesFiltro, setMesFiltro] = useState('');
    const [alerta, setAlerta] = useState(null);

    const allProgramacion = (data.diagramas || []).flatMap(d => d.programacion || []);

    const mesesDisponibles = [...new Set(allProgramacion.map(p => {
        const d = new Date(`${p.fechaInicio}T00:00:00`); 
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }))].sort().reverse();

    const generarReporteMensual = async () => {
        if (!mesFiltro) return;
        addLog('Reportes', `Generó reporte mensual en PDF para ${mesFiltro}`);

        try {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js');

            const { jsPDF } = window.jspdf; const doc = new jsPDF();
            const [y, m] = mesFiltro.split('-');
            const nombreMes = new Date(y, m - 1).toLocaleString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase();
            
            doc.setFontSize(16); doc.setTextColor(15, 23, 42); 
            doc.text(`CURSOS DEL MES (${nombreMes})`, 14, 20);

            const cursosDelMes = allProgramacion.filter(p => p.fechaInicio.startsWith(mesFiltro)).sort((a, b) => a.curso.nombre.localeCompare(b.curso.nombre));
            const tableColumn = ["Nombre del Curso", "Número de Participantes"];
            const tableRows = cursosDelMes.map(prog => [prog.curso.nombre, prog.alumnos.length.toString()]);
            if (cursosDelMes.length === 0) tableRows.push(["No hay cursos registrados", "-"]);

            doc.autoTable({ 
                head: [tableColumn], body: tableRows, startY: 30, theme: 'striped', 
                headStyles: { fillColor: [15, 23, 42] }, styles: { fontSize: 11, cellPadding: 5 } 
            });
            doc.save(`Reporte_${nombreMes.replace(/ /g, '_')}.pdf`);
            setAlerta({ tipo: 'success', texto: 'Reporte PDF generado.' });
        } catch (error) { setAlerta({ tipo: 'error', texto: 'Error al generar el PDF.' }); } 
        finally { setTimeout(() => setAlerta(null), 3000); }
    };

    return (
        <div className="relative min-h-[calc(100vh-5rem)] -m-4 md:-m-8 lg:-m-10 p-4 md:p-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-900 -z-10"></div>
            <div className="animate-in fade-in zoom-in-95 duration-300 max-w-2xl w-full mx-auto p-8 bg-slate-800 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-slate-700">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={goBack} className="p-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition-colors shadow-sm" title="Página anterior">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="p-4 bg-pink-500/20 text-pink-400 rounded-2xl"><FileText className="w-8 h-8" /></div>
                    <div><h2 className="text-3xl font-extrabold text-white">Reportes Mensuales</h2><p className="text-slate-400">Resumen en PDF de cursos impartidos (Global)</p></div>
                </div>
                {alerta && <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${alerta.tipo==='error'?'bg-red-500/20 text-red-300':'bg-emerald-500/20 text-emerald-300'}`}>{alerta.tipo==='error'?<AlertTriangle className="w-5 h-5"/>:<CheckCircle2 className="w-5 h-5"/>} <span className="font-medium">{alerta.texto}</span></div>}
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-semibold text-slate-400">Seleccione el mes a reportar</label>
                        <select value={mesFiltro} onChange={(e) => setMesFiltro(e.target.value)} className="w-full mt-2 p-4 bg-slate-900 border border-slate-700 text-white rounded-2xl outline-none">
                            <option value="">Seleccione un mes...</option>
                            {mesesDisponibles.map(m => {
                                const [yy, mm] = m.split('-');
                                const label = new Date(yy, mm - 1).toLocaleString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase();
                                return <option key={m} value={m}>{label}</option>
                            })}
                        </select>
                    </div>
                    <button onClick={generarReporteMensual} disabled={!mesFiltro} className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-slate-700 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">
                        <Download className="w-5 h-5"/> DESCARGAR REPORTE EN PDF
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem('l68_current_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Nuevo Ref para controlar silenciosamente el modo invitado
    const isGuestRef = useRef(currentUser?.role === 'guest');

    const [step, setStepState] = useState(() => {
        const savedUser = localStorage.getItem('l68_current_user');
        return savedUser ? 'home' : 'login';
    });

    const [stepHistory, setStepHistory] = useState([]);
    const [data, setData] = useState(initialData);
    const [dataLoaded, setDataLoaded] = useState(false);

    const handleSetStep = (newStep) => {
        if (newStep !== step) {
            setStepHistory(prev => {
                const newHist = [...prev, step];
                return newHist.length > 20 ? newHist.slice(newHist.length - 20) : newHist;
            });
            setStepState(newStep);
        }
    };

    const handleGoBack = () => {
        setStepHistory(prev => {
            const newHist = [...prev];
            const previous = newHist.pop();
            if (previous) {
                setStepState(previous);
            } else {
                setStepState('home');
            }
            return newHist;
        });
    };

    const handleUpdateData = (newDataOrUpdater) => {
        setData(prev => {
            const finalData = typeof newDataOrUpdater === 'function' ? newDataOrUpdater(prev) : newDataOrUpdater;
            
            // LÓGICA DE MODO INVITADO: Retornamos la data local pero NO ejecutamos setDoc (No guardamos en Firebase)
            if (isGuestRef.current) {
                return finalData;
            }

            setDoc(docRef, finalData).catch(err => console.error("Error nube:", err));
            localStorage.setItem('l68_afac_data', JSON.stringify(finalData));
            return finalData;
        });
    };

    useEffect(() => {
        let isResolved = false;
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            isResolved = true;
            
            // Si el usuario es invitado, ignoramos todos los cambios de la BD para no borrar su demo
            if (isGuestRef.current) return;

            if (docSnap.exists()) {
                const fetchedData = docSnap.data();
                if (!fetchedData.usuarios) fetchedData.usuarios = initialData.usuarios;
                if (!fetchedData.instructores) fetchedData.instructores = initialData.instructores;
                
                if (fetchedData.programacion && fetchedData.programacion.length > 0) {
                    if (!fetchedData.diagramas) fetchedData.diagramas = [];
                    fetchedData.diagramas.push({
                        id: 'legacy_data',
                        nombre: 'CURSOS ANTERIORES',
                        programacion: fetchedData.programacion
                    });
                    fetchedData.programacion = []; 
                    setDoc(docRef, fetchedData).catch(err => console.error(err));
                }

                setData(fetchedData);
            } else { setDoc(docRef, initialData); }
            setDataLoaded(true);
        }, (error) => {
            console.error("Error de conexión en tiempo real:", error);
            if (!isResolved) {
                isResolved = true;
                const savedData = localStorage.getItem('l68_afac_data');
                if (savedData) setData(JSON.parse(savedData));
                setDataLoaded(true);
            }
        });

        const timeoutId = setTimeout(() => {
            if (!isResolved) {
                isResolved = true;
                console.warn("Tiempo de conexión agotado. Usando memoria local.");
                const savedData = localStorage.getItem('l68_afac_data');
                if (savedData) setData(JSON.parse(savedData));
                setDataLoaded(true);
            }
        }, 5000);

        return () => { unsubscribe(); clearTimeout(timeoutId); };
    }, []);

    const addLog = (module, action, userName = currentUser?.name) => {
        const newLog = { id: Date.now().toString(), timestamp: new Date().toISOString(), user: userName || 'Sistema', module, action };
        handleUpdateData(prev => ({ ...prev, logs: [...(prev.logs || []), newLog] }));
    };

    const handleClearLogs = () => { handleUpdateData(prev => ({ ...prev, logs: [] })); addLog('Sistema', 'Vació historial', currentUser?.name); };
    
    const handleLogin = (user) => { 
        setCurrentUser(user); 
        localStorage.setItem('l68_current_user', JSON.stringify(user)); 
        isGuestRef.current = (user.role === 'guest');
        setStepHistory([]);
        setStepState('home'); 
        
        if (user.role === 'guest') {
            // Vaciar sistema para el modo demostración
            setData({
                empresas: [],
                alumnos: [],
                instructores: [],
                cursos: [],
                diagramas: [],
                ausencias: [],
                logs: [],
                usuarios: data.usuarios
            });
        } else {
            addLog('Sistema', `Inició sesión`, user.name); 
        }
    };

    const handleLogout = () => { 
        if(currentUser && currentUser.role !== 'guest') addLog('Sistema', `Cerró sesión`, currentUser.name); 
        
        const wasGuest = isGuestRef.current;
        setCurrentUser(null); 
        isGuestRef.current = false;
        localStorage.removeItem('l68_current_user'); 
        setStepState('login'); 
        
        // Al salir del modo invitado, forzamos recargar la página para recuperar los datos reales de la BD
        if (wasGuest) {
            window.location.reload();
        }
    };

    if (step === 'login') return <LoginScreen onLogin={handleLogin} data={data} />;
    if (!dataLoaded) return <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4"><div className="text-center animate-pulse"><Plane className="w-16 h-16 text-sky-500 mx-auto mb-4" /><p className="text-sky-400 font-bold tracking-widest uppercase">Conectando...</p></div></div>;

    const DashboardCard = ({ icon: Icon, title, desc, action, color }) => (
        <button 
            onClick={() => handleSetStep(action)} 
            className="group relative flex flex-col p-5 bg-white/95 backdrop-blur-md rounded-[1.5rem] shadow-lg shadow-slate-900/5 border border-white hover:border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden text-left h-full"
        >
            <div className={`absolute -right-8 -top-8 w-32 h-32 bg-${color}-100 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`}></div>
            
            <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-md bg-gradient-to-br from-${color}-400 to-${color}-500 text-white group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 leading-tight">{title}</h3>
            </div>
            
            <p className="text-xs font-medium text-slate-500 relative z-10 mb-4 flex-grow line-clamp-2">{desc}</p>
            
            <div className="mt-auto w-full pt-3 border-t border-slate-100 flex items-center justify-between relative z-10">
                <span className={`text-[10px] font-bold text-${color}-600 uppercase tracking-wider`}>Ir al Módulo</span>
                <ChevronRight className={`w-4 h-4 text-${color}-500 group-hover:translate-x-1 transition-transform`} />
            </div>
        </button>
    );

    const renderContent = () => {
        switch(step) {
            case 'empresa': return <FormEmpresa data={data} setData={handleUpdateData} addLog={addLog} goBack={handleGoBack} />;
            case 'alumno': return <FormAlumno data={data} setData={handleUpdateData} addLog={addLog} goBack={handleGoBack} />;
            case 'instructor': return <FormInstructor data={data} setData={handleUpdateData} addLog={addLog} goBack={handleGoBack} />;
            case 'curso': return <FormCurso data={data} setData={handleUpdateData} addLog={addLog} goBack={handleGoBack} />;
            case 'ausencias': return <FormAusencia data={data} setData={handleUpdateData} addLog={addLog} goBack={handleGoBack} />;
            case 'gantt': return <GanttBuilder data={data} setData={handleUpdateData} addLog={addLog} goBack={handleGoBack} />;
            case 'reportes': return <ReportesMensuales data={data} addLog={addLog} goBack={handleGoBack} />;
            case 'logs': return <AuditLogs data={data} onClearLogs={handleClearLogs} goBack={handleGoBack} />;
            case 'users': return <GestorUsuarios data={data} setData={handleUpdateData} addLog={addLog} goBack={handleGoBack} />;
            default: return (
                <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl shadow-slate-900/40 p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
                        <div className="absolute inset-0 bg-cover bg-center -z-10 filter brightness-[0.45]" style={{ backgroundImage: `url('/BOEING.jpg?v=2')` }}></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-transparent -z-10"></div>
                        <div className="relative z-10 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 mb-5 text-sky-400 text-xs font-bold uppercase tracking-widest shadow-inner"><ShieldCheck className="w-4 h-4" /> Centro Autorizado L68</div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight tracking-tight drop-shadow-md">Organizador de <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Adiestramiento</span></h1>
                            <p className="text-sm md:text-base text-slate-200 font-medium max-w-xl drop-shadow">Bienvenidos al sistema para la gestión de cursos del centro de adiestramiento L68. Made by. Ing Marco López</p>
                            <div className="mt-6 flex flex-wrap justify-center md:justify-start items-center gap-3">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-medium border border-white/20">
                                    <User className="w-4 h-4" /> Activo: <span className="font-bold text-sky-300">{currentUser.name}</span>
                                    {currentUser?.role === 'guest' && <span className="ml-2 bg-rose-500 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-white shadow-sm">Invitado</span>}
                                </div>
                                <button onClick={() => handleSetStep('ausencias')} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-lg transition-colors border border-rose-400"><CalendarDays className="w-4 h-4" /> REPORTAR AUSENCIA</button>
                            </div>
                        </div>
                        <div className="relative z-10 hidden md:block drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                            <img src="/logo-ocean.png" alt="L68" className="w-28 h-28 object-contain [mix-blend-mode:screen] filter contrast-125 brightness-110 animate-pulse" onError={(e) => e.target.style.display = 'none'} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                        <DashboardCard icon={Building2} title="Empresas" color="sky" action="empresa" desc="Directorio de aerolíneas contratantes." />
                        <DashboardCard icon={Users} title="Alumnos" color="emerald" action="alumno" desc="Inscripción de personal y tripulantes." />
                        <DashboardCard icon={GraduationCap} title="Instructores" color="fuchsia" action="instructor" desc="Alta y gestión de instructores." />
                        <DashboardCard icon={BookOpen} title="Cursos" color="indigo" action="curso" desc="Catálogo de materias (Online/Presencial)." />
                        <DashboardCard icon={LayoutDashboard} title="Gantt & IA" color="amber" action="gantt" desc="Planificador Automático IA y Manual." />
                        <DashboardCard icon={FileText} title="Reportes PDF" color="pink" action="reportes" desc="Resumen tabular mensual de cursos." />
                        {currentUser?.role === 'admin' && <DashboardCard icon={UserCog} title="Usuarios" color="purple" action="users" desc="Gestión de accesos y cuentas." />}
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 font-sans selection:bg-sky-500/30">
            <Navbar 
                step={step} 
                setStep={handleSetStep} 
                currentUser={currentUser} 
                onLogout={handleLogout} 
            />
            <main className="p-4 md:p-8 lg:p-10 max-w-[1400px] mx-auto relative z-0">
                {renderContent()}
            </main>
        </div>
    );
}