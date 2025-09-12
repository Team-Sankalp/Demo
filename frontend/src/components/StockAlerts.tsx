import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle, Clock, Package } from "lucide-react";

interface StockAlert {
  id: string;
  productName: string;
  currentStock: number;
  reorderPoint: number;
  suggestedOrder: number;
  supplier: string;
  priority: "high" | "medium" | "low";
  daysUntilStockout: number;
  status: "pending" | "acknowledged" | "resolved";
}

export const StockAlerts = () => {
  const alerts: StockAlert[] = [
    {
      id: "A001",
      productName: "5G Router - Industrial",
      currentStock: 12,
      reorderPoint: 20,
      suggestedOrder: 50,
      supplier: "NetworkPro Ltd",
      priority: "high",
      daysUntilStockout: 3,
      status: "pending",
    },
    {
      id: "A002",
      productName: "Antenna Array - 2.4GHz",
      currentStock: 0,
      reorderPoint: 15,
      suggestedOrder: 30,
      supplier: "Signal Systems",
      priority: "high",
      daysUntilStockout: 0,
      status: "pending",
    },
    {
      id: "A003",
      productName: "Ethernet Switch - 24 Port",
      currentStock: 18,
      reorderPoint: 20,
      suggestedOrder: 25,
      supplier: "NetworkPro Ltd",
      priority: "medium",
      daysUntilStockout: 7,
      status: "acknowledged",
    },
    {
      id: "A004",
      productName: "Fiber Splice Closure",
      currentStock: 8,
      reorderPoint: 10,
      suggestedOrder: 20,
      supplier: "Fiber Solutions Co",
      priority: "medium",
      daysUntilStockout: 5,
      status: "pending",
    },
    {
      id: "A005",
      productName: "Coaxial Cable - RG6",
      currentStock: 25,
      reorderPoint: 30,
      suggestedOrder: 100,
      supplier: "TechCorp Solutions",
      priority: "low",
      daysUntilStockout: 14,
      status: "resolved",
    },
  ];

  const getPriorityBadge = (priority: StockAlert["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: StockAlert["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Pending</Badge>;
      case "acknowledged":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Acknowledged</Badge>;
      case "resolved":
        return <Badge className="bg-success text-success-foreground">Resolved</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: StockAlert["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "acknowledged":
        return <AlertTriangle className="h-4 w-4 text-blue-600" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return <Package className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const pendingAlerts = alerts.filter(alert => alert.status === "pending");
  const acknowledgedAlerts = alerts.filter(alert => alert.status === "acknowledged");

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold">{alerts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Actions</p>
                <p className="text-2xl font-bold text-destructive">{pendingAlerts.length}</p>
              </div>
              <Clock className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{acknowledgedAlerts.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Stock Level Alerts</span>
          </CardTitle>
          <CardDescription>
            Monitor low stock levels and take action to prevent stockouts
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Reorder Point</TableHead>
                  <TableHead>Suggested Order</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Days Until Stockout</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">{alert.id}</TableCell>
                    <TableCell>{alert.productName}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        alert.currentStock === 0 ? 'text-destructive' : 
                        alert.currentStock < alert.reorderPoint ? 'text-warning' : 'text-foreground'
                      }`}>
                        {alert.currentStock}
                      </span>
                    </TableCell>
                    <TableCell>{alert.reorderPoint}</TableCell>
                    <TableCell className="font-medium">{alert.suggestedOrder}</TableCell>
                    <TableCell>{alert.supplier}</TableCell>
                    <TableCell>{getPriorityBadge(alert.priority)}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        alert.daysUntilStockout === 0 ? 'text-destructive' : 
                        alert.daysUntilStockout <= 3 ? 'text-warning' : 'text-foreground'
                      }`}>
                        {alert.daysUntilStockout === 0 ? 'Out of Stock' : `${alert.daysUntilStockout} days`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(alert.status)}
                        {getStatusBadge(alert.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {alert.status === "pending" && (
                          <>
                            <Button size="sm" className="bg-gradient-primary">
                              Order Now
                            </Button>
                            <Button variant="outline" size="sm">
                              Acknowledge
                            </Button>
                          </>
                        )}
                        {alert.status === "acknowledged" && (
                          <Button size="sm" className="bg-gradient-primary">
                            Mark Resolved
                          </Button>
                        )}
                        {alert.status === "resolved" && (
                          <Badge className="bg-success text-success-foreground">
                            Completed
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};