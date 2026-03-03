export function validateProjectName(name: string): string | null {
  if (name && name.trim().length < 3) {
    return "Mínimo 3 caracteres";
  }
  return null;
}

export function validateOwner(owner: string): string | null {
  if (owner && owner.trim().length < 2) {
    return "Owner muy corto";
  }
  return null;
}

export function validateBudget(budget: string): string | null {
  if (isNaN(Number(budget))) {
    return "Debe ser número";
  }
  return null;
}
