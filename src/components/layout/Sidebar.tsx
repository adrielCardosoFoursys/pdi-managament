import { 
  BarChart3, 
  Building2, 
  Calendar, 
  CheckSquare, 
  DollarSign, 
  FileText, 
  FolderOpen, 
  Home, 
  Settings, 
  Target, 
  Users 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'portfolio', label: 'Portfólio', icon: FolderOpen },
    { id: 'projetos', label: 'Projetos', icon: FileText },
    { id: 'entidades', label: 'Entidades', icon: Building2 },
    { id: 'equipe', label: 'Equipe', icon: Users },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'cronograma', label: 'Cronograma', icon: Calendar },
    { id: 'krs', label: 'KRs & Métricas', icon: Target },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
    { id: 'admin', label: 'Administração', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex flex-col space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'default' : 'ghost'}
              className={cn(
                'justify-start w-full',
                activeTab === item.id && 'bg-primary text-primary-foreground'
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}
