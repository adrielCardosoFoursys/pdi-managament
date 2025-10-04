"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = Sidebar;
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var utils_1 = require("@/lib/utils");
function Sidebar(_a) {
    var activeTab = _a.activeTab, onTabChange = _a.onTabChange;
    var menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: lucide_react_1.Home },
        { id: 'portfolio', label: 'Portfólio', icon: lucide_react_1.FolderOpen },
        { id: 'projetos', label: 'Projetos', icon: lucide_react_1.FileText },
        { id: 'entidades', label: 'Entidades', icon: lucide_react_1.Building2 },
        { id: 'equipe', label: 'Equipe', icon: lucide_react_1.Users },
        { id: 'financeiro', label: 'Financeiro', icon: lucide_react_1.DollarSign },
        { id: 'cronograma', label: 'Cronograma', icon: lucide_react_1.Calendar },
        { id: 'krs', label: 'KRs & Métricas', icon: lucide_react_1.Target },
        { id: 'relatorios', label: 'Relatórios', icon: lucide_react_1.BarChart3 },
        { id: 'checklist', label: 'Checklist', icon: lucide_react_1.CheckSquare },
        { id: 'admin', label: 'Administração', icon: lucide_react_1.Settings },
    ];
    return (<aside className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex flex-col space-y-1 p-4">
        {menuItems.map(function (item) {
            var Icon = item.icon;
            return (<button_1.Button key={item.id} variant={activeTab === item.id ? 'default' : 'ghost'} className={(0, utils_1.cn)('justify-start w-full', activeTab === item.id && 'bg-primary text-primary-foreground')} onClick={function () { return onTabChange(item.id); }}>
              <Icon className="mr-3 h-4 w-4"/>
              {item.label}
            </button_1.Button>);
        })}
      </nav>
    </aside>);
}
