import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit2, Eye, Package2, Plus, Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  stockLevel: number;
  reorderPoint: number;
  supplier: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
  lastUpdated: string;
}

interface ProductManagementProps {
  searchQuery: string;
}

export const ProductManagement = ({ searchQuery }: ProductManagementProps) => {
  const [products] = useState<Product[]>([
    {
      id: "P001",
      name: "Fiber Optic Cable - 50m",
      category: "Cables",
      stockLevel: 245,
      reorderPoint: 50,
      supplier: "TechCorp Solutions",
      status: "in-stock",
      lastUpdated: "2024-01-15",
    },
    {
      id: "P002",
      name: "5G Router - Industrial",
      category: "Networking",
      stockLevel: 12,
      reorderPoint: 20,
      supplier: "NetworkPro Ltd",
      status: "low-stock",
      lastUpdated: "2024-01-14",
    },
    {
      id: "P003",
      name: "Antenna Array - 2.4GHz",
      category: "Antennas",
      stockLevel: 0,
      reorderPoint: 15,
      supplier: "Signal Systems",
      status: "out-of-stock",
      lastUpdated: "2024-01-10",
    },
    {
      id: "P004",
      name: "Power Supply Unit - 48V",
      category: "Power",
      stockLevel: 85,
      reorderPoint: 25,
      supplier: "PowerTech Inc",
      status: "in-stock",
      lastUpdated: "2024-01-16",
    },
    {
      id: "P005",
      name: "Ethernet Switch - 24 Port",
      category: "Networking",
      stockLevel: 18,
      reorderPoint: 20,
      supplier: "NetworkPro Ltd",
      status: "low-stock",
      lastUpdated: "2024-01-13",
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    stockLevel: "",
    reorderPoint: "",
    supplier: "",
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Product["status"]) => {
    switch (status) {
      case "in-stock":
        return <Badge className="bg-success text-success-foreground">In Stock</Badge>;
      case "low-stock":
        return <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>;
      case "out-of-stock":
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleAddProduct = () => {
    // Simulate adding product
    console.log("Adding product:", newProduct);
    setIsAddDialogOpen(false);
    setNewProduct({
      name: "",
      category: "",
      stockLevel: "",
      reorderPoint: "",
      supplier: "",
    });
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Package2 className="h-5 w-5" />
              <span>Product Management</span>
            </CardTitle>
            <CardDescription>
              Manage your telecom equipment inventory
            </CardDescription>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Enter the details for the new product below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cables">Cables</SelectItem>
                      <SelectItem value="networking">Networking</SelectItem>
                      <SelectItem value="antennas">Antennas</SelectItem>
                      <SelectItem value="power">Power</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stockLevel">Initial Stock Level</Label>
                  <Input
                    id="stockLevel"
                    type="number"
                    value={newProduct.stockLevel}
                    onChange={(e) => setNewProduct({ ...newProduct, stockLevel: e.target.value })}
                    placeholder="Enter initial stock"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reorderPoint">Reorder Point</Label>
                  <Input
                    id="reorderPoint"
                    type="number"
                    value={newProduct.reorderPoint}
                    onChange={(e) => setNewProduct({ ...newProduct, reorderPoint: e.target.value })}
                    placeholder="Enter reorder threshold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    value={newProduct.supplier}
                    onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
                    placeholder="Enter supplier name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct} className="bg-gradient-primary">
                  Add Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Reorder Point</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.stockLevel}</TableCell>
                  <TableCell>{product.reorderPoint}</TableCell>
                  <TableCell>{product.supplier}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};