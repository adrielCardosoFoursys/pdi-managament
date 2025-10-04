"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = Header;
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
function Header() {
    return (<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo e Título */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-primary"></div>
            <h1 className="text-xl font-semibold">Plataforma PDI</h1>
          </div>
        </div>

        {/* Barra de Pesquisa */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <lucide_react_1.Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
            <input type="search" placeholder="Pesquisar projetos..." className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/>
          </div>
        </div>

        {/* Ações do Usuário */}
        <div className="flex items-center space-x-2">
          <button_1.Button variant="ghost" size="icon" className="relative">
            <lucide_react_1.Bell className="h-5 w-5"/>
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              3
            </span>
          </button_1.Button>
          
          <button_1.Button variant="ghost" size="icon">
            <lucide_react_1.Settings className="h-5 w-5"/>
          </button_1.Button>
          
          <button_1.Button variant="ghost" size="icon">
            <lucide_react_1.User className="h-5 w-5"/>
          </button_1.Button>
        </div>
      </div>
    </header>);
}
