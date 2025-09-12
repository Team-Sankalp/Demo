import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Search, 
  Bell, 
  Settings, 
  LogOut,
  Wifi,
  Filter,
  Plus
} from "lucide-react";
import { ProductManagement } from "@/components/ProductManagement";
import { SupplierManagement } from "@/components/SupplierManagement";
import { StockAlerts } from "@/components/StockAlerts";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    // Redirect to login page
    window.location.href = "/login";
  };

  const statsCards = [
    {
      title: "Total Products",
      value: "1,247",
      description: "Active inventory items",
      icon: Package,
      trend: "+12%",
      color: "text-primary",
    },
    {
      title: "Suppliers",
      value: "86",
      description: "Registered suppliers",
      icon: Users,
      trend: "+3%",
      color: "text-accent",
    },
    {
      title: "Low Stock Alerts",
      value: "23",
      description: "Items need restocking",
      icon: AlertTriangle,
      trend: "-8%",
      color: "text-warning",
    },
    {
      title: "Monthly Growth",
      value: "15.2%",
      description: "Inventory turnover",
      icon: TrendingUp,
      trend: "+5%",
      color: "text-success",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-soft">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <Wifi className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-primary">TIMS</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-foreground">
                  Telecom Inventory Management
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 h-10"
                />
              </div>
              
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-destructive">
                  3
                </Badge>
              </Button>
              
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium ${
                    stat.trend.startsWith('+') ? 'text-success' : 'text-destructive'
                  }`}>
                    {stat.trend}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-fit grid-cols-4">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </div>
          </div>

          <TabsContent value="products" className="space-y-6">
            <ProductManagement searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-6">
            <SupplierManagement searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <StockAlerts />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Inventory Reports</CardTitle>
                <CardDescription>
                  Generate and view detailed inventory reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Reports Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Advanced reporting features will be available in the next update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;