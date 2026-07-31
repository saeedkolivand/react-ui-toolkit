import type { TableColumn } from "@crosskit-ui/core";

export interface Person {
  name: string;
  role: string;
}

/**
 * The single source of the parity page's content.
 *
 * Copied byte for byte into each playground rather than shared through a
 * package: a shared import would let a build-order mistake serve one framework
 * stale data, and the screenshots would differ for a reason that has nothing to
 * do with the adapters. A CI check asserts the four copies stay identical.
 */
export const FIXTURE = {
  text: "The quick brown fox jumps over the lazy dog.",
  email: "ada@example.com",
  progress: 62,
  sizes: ["sm", "md", "lg"] as const,
  buttonVariants: [
    "primary",
    "secondary",
    "outline",
    "ghost",
    "success",
    "error",
    "warning",
    "info",
  ] as const,
  badgeVariants: ["primary", "neutral", "success", "error", "warning", "info"] as const,
  tagColors: ["neutral", "primary", "success", "error", "warning", "info"] as const,
  alertVariants: ["info", "success", "warning", "error"] as const,
  icons: ["check", "close", "search", "settings", "heart", "star"] as const,
  countries: [
    { value: "ng", label: "Nigeria" },
    { value: "gh", label: "Ghana" },
    { value: "ke", label: "Kenya" },
  ],
  tabs: [
    { id: "overview", label: "Overview" },
    { id: "settings", label: "Settings" },
    { id: "billing", label: "Billing" },
  ],
  accordion: [
    { id: "shipping", title: "Shipping" },
    { id: "returns", title: "Returns" },
  ],
  people: [
    { name: "Ada Lovelace", role: "Analyst" },
    { name: "Grace Hopper", role: "Rear Admiral" },
    { name: "Alan Turing", role: "Cryptanalyst" },
    { name: "Edsger Dijkstra", role: "Professor" },
  ] as Person[],
  columns: [
    { id: "name", header: "Name", accessor: "name", sortable: true },
    { id: "role", header: "Role", accessor: "role" },
  ] as TableColumn<Person>[],
};
