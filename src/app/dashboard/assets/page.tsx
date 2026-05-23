export const dynamic = "force-dynamic";

import { Layers, FolderOpen, ImageIcon, Film, FileArchive } from "lucide-react";

const CATEGORIES = [
  { icon: ImageIcon, label: "Textures", count: 0, color: "text-blue-400" },
  { icon: Layers,    label: "Materials", count: 0, color: "text-violet-400" },
  { icon: FolderOpen,label: "3D Models", count: 0, color: "text-amber-400" },
  { icon: Film,      label: "HDRIs", count: 0, color: "text-emerald-400" },
  { icon: FileArchive,label: "Archives", count: 0, color: "text-rose-400" },
];

export default function AssetsPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Asset Library</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Textures, materials, HDRI maps and 3D assets for your projects
        </p>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {CATEGORIES.map(({ icon: Icon, label, count, color }) => (
          <div
            key={label}
            className="rounded-xl bg-hunter-elevated border border-hunter-border p-5 flex flex-col items-center gap-3 text-center opacity-60 cursor-not-allowed select-none"
          >
            <div className="w-10 h-10 rounded-lg bg-hunter-card border border-hunter-border flex items-center justify-center">
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{count} items</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-14 h-14 rounded-2xl bg-hunter-elevated border border-hunter-border flex items-center justify-center mb-4">
          <Layers className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">Asset Library coming soon</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
          Upload and organise textures, materials, HDRI maps and 3D model archives for reuse across projects.
        </p>
      </div>
    </div>
  );
}
