
export interface MissedIngredient {
  id?: any | null,
  amount: number,
  unit: string,
  original: string,
}

export interface Food {
  id?: any | null,
  image: string,
  imageType: string,
  likes: number,
  missedIngredientCount: number,
  missedIngredients: MissedIngredient[],
  title: string,
}

export interface InstructionTemperature {
  number: number,
  unit: string,
}

export interface InstructionEquipment {
  id?: any | null,
  image: string,
  name: string,
  temperature: InstructionTemperature,
}

export interface InstructionStep {
  equipment: InstructionEquipment[],
  ingredients: any,
  number: number,
  step: string
}

export interface FoodInstruction {
  name: string,
  steps: InstructionStep[],
}
