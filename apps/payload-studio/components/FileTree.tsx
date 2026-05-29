"use client";

import type { TreeNode } from "@/lib/vfs";

interface Props {
  root: TreeNode;
  activePath: string | null;
  onSelect: (path: string) => void;
  onDelete: (path: string) => void;
}

function Node({
  node,
  depth,
  activePath,
  onSelect,
  onDelete,
}: {
  node: TreeNode;
  depth: number;
} & Pick<Props, "activePath" | "onSelect" | "onDelete">) {
  const isFile = !!node.file;
  const active = node.path === activePath;
  return (
    <div>
      <div
        className={`flex items-center gap-2 px-1 py-0.5 rounded text-sm ${
          active ? "bg-kinform-torque/20 text-kinform-torque" : "text-white/80"
        } ${isFile ? "cursor-pointer hover:bg-white/5" : "text-white/60"}`}
        style={{ paddingLeft: depth * 12 + 4 }}
        onClick={() => isFile && onSelect(node.path)}
      >
        <span className="font-mono text-xs">
          {isFile ? (node.file?.approved ? "✓" : "•") : "▸"}
        </span>
        <span className="truncate">{node.name}</span>
        {isFile && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete ${node.path}?`)) onDelete(node.path);
            }}
            className="ml-auto opacity-0 group-hover:opacity-100 hover:text-red-400 text-xs"
            title="Delete"
          >
            ✕
          </button>
        )}
      </div>
      {node.children?.map((c) => (
        <Node
          key={c.path}
          node={c}
          depth={depth + 1}
          activePath={activePath}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default function FileTree({ root, activePath, onSelect, onDelete }: Props) {
  return (
    <div className="group">
      <h2 className="text-xs uppercase tracking-widest text-white/40 mb-2">
        Workspace
      </h2>
      {root.children?.length ? (
        root.children.map((c) => (
          <Node
            key={c.path}
            node={c}
            depth={0}
            activePath={activePath}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))
      ) : (
        <p className="text-xs text-white/40">No files yet.</p>
      )}
    </div>
  );
}
