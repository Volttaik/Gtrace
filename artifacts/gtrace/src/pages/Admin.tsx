import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, MapPin, Navigation, Edit, Trash2, Package as PkgIcon, Search } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { LocationSearchPicker } from "@/components/LocationSearchPicker"
import { 
  usePackages, 
  useCreatePackageMutation, 
  useUpdatePackageMutation, 
  useDeletePackageMutation,
  useUpdateLocationMutation,
  useScheduleMoveMutation
} from "@/hooks/use-packages"
import type { Package, Location } from "@workspace/api-client-react/src/generated/api.schemas"
import { formatDate } from "@/lib/utils"

export default function Admin() {
  const { data, isLoading } = usePackages();
  const createMut = useCreatePackageMutation();
  const deleteMut = useDeletePackageMutation();
  const updateLocMut = useUpdateLocationMutation();
  const scheduleMut = useScheduleMoveMutation();
  const updatePkgMut = useUpdatePackageMutation();

  const [search, setSearch] = useState("");
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [updateLocPkg, setUpdateLocPkg] = useState<Package | null>(null);
  const [schedulePkg, setSchedulePkg] = useState<Package | null>(null);
  const [editPkg, setEditPkg] = useState<Package | null>(null);

  const packages = data?.packages.filter(p => 
    p.trackingId.toLowerCase().includes(search.toLowerCase()) || 
    p.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      deleteMut.mutate({ id });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex flex-col pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage global shipments and track routes</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Package
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card flex-1 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6 max-w-sm">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search by ID or Name..." 
              value={search} onChange={e => setSearch(e.target.value)}
              className="bg-white/5"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-white/5 border-y border-white/10">
                <tr>
                  <th className="px-4 py-4 font-medium rounded-tl-lg">Tracking ID</th>
                  <th className="px-4 py-4 font-medium">Package</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                  <th className="px-4 py-4 font-medium">Location</th>
                  <th className="px-4 py-4 font-medium">Destination</th>
                  <th className="px-4 py-4 font-medium text-right rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">Loading packages...</td></tr>
                ) : packages.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No packages found.</td></tr>
                ) : packages.map((pkg) => (
                  <tr key={pkg._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-4 font-mono text-primary font-medium">{pkg.trackingId}</td>
                    <td className="px-4 py-4 font-medium text-foreground">{pkg.name}</td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/10 uppercase border border-white/10">
                        {pkg.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground truncate max-w-[150px]">{pkg.currentLocation.name}</td>
                    <td className="px-4 py-4 text-muted-foreground truncate max-w-[150px]">{pkg.destination.name}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setUpdateLocPkg(pkg)} title="Update Location" className="h-8 w-8 p-0">
                          <MapPin className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setSchedulePkg(pkg)} title="Schedule Move" className="h-8 w-8 p-0 text-accent hover:text-accent">
                          <Navigation className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditPkg(pkg)} className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(pkg._id)} className="h-8 w-8 p-0">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>

      {/* CREATE PACKAGE MODAL */}
      <CreateEditModal 
        open={isCreateOpen || !!editPkg} 
        onClose={() => { setIsCreateOpen(false); setEditPkg(null); }}
        pkg={editPkg}
        onSave={(data) => {
          if (editPkg) updatePkgMut.mutate({ id: editPkg._id, data }, { onSuccess: () => { setEditPkg(null); } });
          else createMut.mutate({ data }, { onSuccess: () => setIsCreateOpen(false) });
        }}
      />

      {/* UPDATE LOCATION MODAL */}
      <Dialog open={!!updateLocPkg} onOpenChange={(o) => !o && setUpdateLocPkg(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Update Location - {updateLocPkg?.trackingId}</DialogTitle></DialogHeader>
          <UpdateLocationForm 
            onSubmit={(formData) => {
              if (updateLocPkg) updateLocMut.mutate({ id: updateLocPkg._id, data: formData }, { onSuccess: () => setUpdateLocPkg(null) });
            }} 
            isPending={updateLocMut.isPending}
          />
          <DialogClose onClick={() => setUpdateLocPkg(null)} />
        </DialogContent>
      </Dialog>

      {/* SCHEDULE MOVE MODAL */}
      <Dialog open={!!schedulePkg} onOpenChange={(o) => !o && setSchedulePkg(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Schedule Move - {schedulePkg?.trackingId}</DialogTitle></DialogHeader>
          <ScheduleMoveForm 
            onSubmit={(formData) => {
              if (schedulePkg) scheduleMut.mutate({ id: schedulePkg._id, data: formData }, { onSuccess: () => setSchedulePkg(null) });
            }} 
            isPending={scheduleMut.isPending}
          />
          <DialogClose onClick={() => setSchedulePkg(null)} />
        </DialogContent>
      </Dialog>

    </div>
  )
}

function CreateEditModal({ open, onClose, pkg, onSave }: any) {
  const [origin, setOrigin] = useState<Location | null>(pkg?.origin || null);
  const [destination, setDestination] = useState<Location | null>(pkg?.destination || null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!origin || !destination) return alert("Origin and Destination are required");
    
    onSave({
      name: fd.get("name"),
      description: fd.get("description"),
      weight: fd.get("weight"),
      category: fd.get("category"),
      status: fd.get("status"),
      origin,
      destination
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{pkg ? "Edit" : "Create"} Package</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Package Name *</label>
              <Input name="name" defaultValue={pkg?.name} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <select name="status" defaultValue={pkg?.status || "pending"} className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-primary outline-none">
                <option value="pending">Pending</option>
                <option value="in_transit">In Transit</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="exception">Exception</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Description *</label>
            <Input name="description" defaultValue={pkg?.description} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Origin *</label>
              <LocationSearchPicker value={origin || undefined} onChange={setOrigin} placeholder="Search origin..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Destination *</label>
              <LocationSearchPicker value={destination || undefined} onChange={setDestination} placeholder="Search destination..." />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Weight (kg)</label>
              <Input name="weight" defaultValue={pkg?.weight} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Category</label>
              <Input name="category" defaultValue={pkg?.category} />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Package</Button>
          </div>
        </form>
        <DialogClose onClick={onClose} />
      </DialogContent>
    </Dialog>
  );
}

function UpdateLocationForm({ onSubmit, isPending }: any) {
  const [location, setLocation] = useState<Location | null>(null);

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      if (!location) return alert("Select a location");
      onSubmit({
        location,
        status: fd.get("status"),
        description: fd.get("description")
      });
    }} className="space-y-4 mt-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">New Location *</label>
        <LocationSearchPicker value={location || undefined} onChange={setLocation} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Event Status Update</label>
        <Input name="status" placeholder="e.g. Arrived at Port" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Description</label>
        <Input name="description" placeholder="Additional details..." required />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>{isPending ? "Updating..." : "Update Location"}</Button>
    </form>
  )
}

function ScheduleMoveForm({ onSubmit, isPending }: any) {
  const [targetLocation, setTargetLocation] = useState<Location | null>(null);

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      if (!targetLocation) return alert("Select a target location");
      onSubmit({
        targetLocation,
        arrivesInDays: Number(fd.get("days")),
        description: fd.get("description")
      });
    }} className="space-y-4 mt-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Target Location *</label>
        <LocationSearchPicker value={targetLocation || undefined} onChange={setTargetLocation} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Arrives in (Days) *</label>
        <Input name="days" type="number" min="1" required placeholder="e.g. 5" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Description</label>
        <Input name="description" placeholder="e.g. Sailing to destination port" />
      </div>
      <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isPending}>{isPending ? "Scheduling..." : "Schedule Move"}</Button>
    </form>
  )
}
