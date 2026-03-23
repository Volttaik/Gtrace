"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MapPin, Navigation, Edit, Trash2, Search, CheckCircle2, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { AdminGate } from "@/components/AdminGate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { LocationSearchPicker } from "@/components/LocationSearchPicker";
import {
  usePackages,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
  useUpdateLocationMutation,
  useScheduleMoveMutation
} from "@/hooks/use-packages";
import type { Package, Location } from "@workspace/api-client-react";

export default function Admin() {
  const { data, isLoading } = usePackages();
  const createMut = useCreatePackageMutation();
  const deleteMut = useDeletePackageMutation();
  const updateLocMut = useUpdateLocationMutation();
  const scheduleMut = useScheduleMoveMutation();
  const updatePkgMut = useUpdatePackageMutation();

  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [updateLocPkg, setUpdateLocPkg] = useState<Package | null>(null);
  const [schedulePkg, setSchedulePkg] = useState<Package | null>(null);
  const [editPkg, setEditPkg] = useState<Package | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);

  const packages = data?.packages.filter(p =>
    p.trackingId?.toLowerCase().includes(search.toLowerCase()) ||
    p.name?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      deleteMut.mutate({ id });
    }
  };

  const getStatusBadge = (status: string) => {
    let colors = "";
    switch (status) {
      case "delivered": colors = "bg-green-100 text-green-700 border-green-200"; break;
      case "in_transit": colors = "bg-blue-100 text-blue-700 border-blue-200"; break;
      case "exception": colors = "bg-red-100 text-red-700 border-red-200"; break;
      case "out_for_delivery": colors = "bg-indigo-100 text-indigo-700 border-indigo-200"; break;
      default: colors = "bg-gray-100 text-gray-700 border-gray-200"; break;
    }
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase border ${colors}`}>
        {status.replace(/_/g, " ")}
      </span>
    );
  };

  return (
    <AdminGate>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex flex-col pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage global shipments and track routes</p>
            </div>
            <Button onClick={() => setIsCreateOpen(true)} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4" /> Add Package
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="card-surface flex-1 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-3 max-w-sm">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Input placeholder="Search by ID or Name..." value={search} onChange={e => setSearch(e.target.value)} className="bg-white border-border shadow-sm" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-gray-50/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Tracking ID</th>
                    <th className="px-6 py-4 font-medium">Package</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Location</th>
                    <th className="px-6 py-4 font-medium">Destination</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white">
                  {isLoading ? (
                    <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">Loading packages...</td></tr>
                  ) : packages.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No packages found.</td></tr>
                  ) : packages.map((pkg) => (
                    <tr key={pkg._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-primary font-medium">{pkg.trackingId}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{pkg.name}</td>
                      <td className="px-6 py-4">{getStatusBadge(pkg.status)}</td>
                      <td className="px-6 py-4 text-muted-foreground truncate max-w-[150px]">{pkg.currentLocation?.name ?? "—"}</td>
                      <td className="px-6 py-4 text-muted-foreground truncate max-w-[150px]">{pkg.destination?.name ?? "—"}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setUpdateLocPkg(pkg)} title="Update Location" className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-50 text-gray-700"><MapPin className="w-4 h-4" /></Button>
                          <Button variant="outline" size="sm" onClick={() => setSchedulePkg(pkg)} title="Schedule Move" className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-50 text-blue-600"><Navigation className="w-4 h-4" /></Button>
                          <Button variant="outline" size="sm" onClick={() => setEditPkg(pkg)} className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-50 text-gray-700"><Edit className="w-4 h-4" /></Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(pkg._id)} className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </main>

        <CreateEditModal
          open={isCreateOpen || !!editPkg}
          onClose={() => { setIsCreateOpen(false); setEditPkg(null); setCreateSuccess(false); setEditSuccess(false); }}
          pkg={editPkg}
          isPending={editPkg ? updatePkgMut.isPending : createMut.isPending}
          isSuccess={editPkg ? editSuccess : createSuccess}
          onSave={(data: any) => {
            if (editPkg) {
              updatePkgMut.mutate({ id: editPkg._id, data }, {
                onSuccess: () => { setEditSuccess(true); setTimeout(() => { setEditSuccess(false); setEditPkg(null); }, 1600); }
              });
            } else {
              createMut.mutate({ data }, {
                onSuccess: () => { setCreateSuccess(true); setTimeout(() => { setCreateSuccess(false); setIsCreateOpen(false); }, 1600); }
              });
            }
          }}
        />

        <Dialog open={!!updateLocPkg} onOpenChange={(o) => !o && setUpdateLocPkg(null)}>
          <DialogContent className="bg-white border-border shadow-lg">
            <DialogHeader><DialogTitle className="text-foreground">Update Location — {updateLocPkg?.trackingId}</DialogTitle></DialogHeader>
            <UpdateLocationForm
              onSubmit={(formData: any) => {
                if (updateLocPkg) updateLocMut.mutate({ id: updateLocPkg._id, data: formData }, { onSuccess: () => setUpdateLocPkg(null) });
              }}
              isPending={updateLocMut.isPending}
            />
            <DialogClose onClick={() => setUpdateLocPkg(null)} />
          </DialogContent>
        </Dialog>

        <Dialog open={!!schedulePkg} onOpenChange={(o) => !o && setSchedulePkg(null)}>
          <DialogContent className="bg-white border-border shadow-lg">
            <DialogHeader><DialogTitle className="text-foreground">Schedule Move — {schedulePkg?.trackingId}</DialogTitle></DialogHeader>
            <ScheduleMoveForm
              onSubmit={(formData: any) => {
                if (schedulePkg) scheduleMut.mutate({ id: schedulePkg._id, data: formData }, { onSuccess: () => setSchedulePkg(null) });
              }}
              isPending={scheduleMut.isPending}
            />
            <DialogClose onClick={() => setSchedulePkg(null)} />
          </DialogContent>
        </Dialog>
      </div>
    </AdminGate>
  );
}

function CreateEditModal({ open, onClose, pkg, onSave, isPending, isSuccess }: any) {
  const [origin, setOrigin] = useState<Location | null>(pkg?.origin || null);
  const [destination, setDestination] = useState<Location | null>(pkg?.destination || null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!origin || !destination) return alert("Origin and Destination are required");
    onSave({ name: fd.get("name"), description: fd.get("description"), weight: fd.get("weight") ? Number(fd.get("weight")) : undefined, category: fd.get("category"), status: fd.get("status"), origin, destination });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !isPending && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-border shadow-lg">
        <DialogHeader><DialogTitle className="text-foreground">{pkg ? "Edit" : "Create"} Package</DialogTitle></DialogHeader>
        <AnimatePresence>
          {isSuccess && (
            <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.25 }} className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 mt-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500" />
              <span className="font-medium text-sm">Package {pkg ? "updated" : "created"} successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Package Name *</label>
              <Input name="name" defaultValue={pkg?.name} required className="bg-white border-gray-200" disabled={isPending || isSuccess} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select name="status" defaultValue={pkg?.status || "pending"} disabled={isPending || isSuccess} className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60">
                <option value="pending">Pending</option>
                <option value="in_transit">In Transit</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="exception">Exception</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Description *</label>
            <Input name="description" defaultValue={pkg?.description} required className="bg-white border-gray-200" disabled={isPending || isSuccess} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Origin *</label>
              <LocationSearchPicker value={origin || undefined} onChange={setOrigin} placeholder="Search origin..." className={isPending || isSuccess ? "pointer-events-none opacity-60" : ""} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Destination *</label>
              <LocationSearchPicker value={destination || undefined} onChange={setDestination} placeholder="Search destination..." className={isPending || isSuccess ? "pointer-events-none opacity-60" : ""} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Weight (kg)</label>
              <Input name="weight" type="number" step="0.01" defaultValue={pkg?.weight} className="bg-white border-gray-200" disabled={isPending || isSuccess} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Category</label>
              <Input name="category" defaultValue={pkg?.category} className="bg-white border-gray-200" disabled={isPending || isSuccess} />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-200" disabled={isPending}>Cancel</Button>
            <Button type="submit" disabled={isPending || isSuccess} className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[130px] gap-2">
              {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : isSuccess ? <><CheckCircle2 className="w-4 h-4" />Saved!</> : "Save Package"}
            </Button>
          </div>
        </form>
        <DialogClose onClick={() => !isPending && onClose()} />
      </DialogContent>
    </Dialog>
  );
}

function UpdateLocationForm({ onSubmit, isPending }: any) {
  const [location, setLocation] = useState<Location | null>(null);
  return (
    <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); if (!location) return alert("Select a location"); onSubmit({ location, status: fd.get("status"), description: fd.get("description") }); }} className="space-y-4 mt-4">
      <div className="space-y-2"><label className="text-sm font-medium text-slate-700">New Location *</label><LocationSearchPicker value={location || undefined} onChange={setLocation} /></div>
      <div className="space-y-2"><label className="text-sm font-medium text-slate-700">Event Status Update</label><Input name="status" placeholder="e.g. Arrived at Port" required className="bg-white border-gray-200" /></div>
      <div className="space-y-2"><label className="text-sm font-medium text-slate-700">Description</label><Input name="description" placeholder="Additional details..." required className="bg-white border-gray-200" /></div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2" disabled={isPending}>
        {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Updating…</> : "Update Location"}
      </Button>
    </form>
  );
}

function ScheduleMoveForm({ onSubmit, isPending }: any) {
  const [targetLocation, setTargetLocation] = useState<Location | null>(null);
  return (
    <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); if (!targetLocation) return alert("Select a target location"); onSubmit({ targetLocation, arrivesInDays: Number(fd.get("days")), description: fd.get("description") }); }} className="space-y-4 mt-4">
      <div className="space-y-2"><label className="text-sm font-medium text-slate-700">Target Location *</label><LocationSearchPicker value={targetLocation || undefined} onChange={setTargetLocation} /></div>
      <div className="space-y-2"><label className="text-sm font-medium text-slate-700">Arrives in (Days) *</label><Input name="days" type="number" min="1" required placeholder="e.g. 5" className="bg-white border-gray-200" /></div>
      <div className="space-y-2"><label className="text-sm font-medium text-slate-700">Description</label><Input name="description" placeholder="e.g. Sailing to destination port" className="bg-white border-gray-200" /></div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2" disabled={isPending}>
        {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Scheduling…</> : "Schedule Move"}
      </Button>
    </form>
  );
}
