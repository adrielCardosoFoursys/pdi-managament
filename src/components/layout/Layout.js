"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = Layout;
var Header_1 = require("./Header");
var Sidebar_1 = require("./Sidebar");
function Layout(_a) {
    var children = _a.children, activeTab = _a.activeTab, onTabChange = _a.onTabChange;
    return (<div className="min-h-screen bg-background">
      <Header_1.Header />
      <div className="flex">
        <Sidebar_1.Sidebar activeTab={activeTab} onTabChange={onTabChange}/>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>);
}
