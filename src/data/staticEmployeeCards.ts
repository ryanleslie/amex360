
// Static data file containing all employee cards with their boost status
// This determines which cards have received the 15,000 point bonus

export interface EmployeeCardBonus {
  cardKey: string
  cardType: string
  lastFive: string
  hasBonus: boolean
}

// All employee cards with their current bonus status - organized by card type and sorted by last five digits
export let employeeCardBonuses: EmployeeCardBonus[] = [
  // Business Blue Plus I cards - sorted by last five digits in ascending order
  { cardKey: "Business Blue Plus I--01018", cardType: "Business Blue Plus I", lastFive: "-01018", hasBonus: true },
  { cardKey: "Business Blue Plus I--01026", cardType: "Business Blue Plus I", lastFive: "-01026", hasBonus: true },
  { cardKey: "Business Blue Plus I--01067", cardType: "Business Blue Plus I", lastFive: "-01067", hasBonus: true },
  { cardKey: "Business Blue Plus I--01075", cardType: "Business Blue Plus I", lastFive: "-01075", hasBonus: true },
  { cardKey: "Business Blue Plus I--01083", cardType: "Business Blue Plus I", lastFive: "-01083", hasBonus: true },
  { cardKey: "Business Blue Plus I--01091", cardType: "Business Blue Plus I", lastFive: "-01091", hasBonus: true },
  { cardKey: "Business Blue Plus I--01109", cardType: "Business Blue Plus I", lastFive: "-01109", hasBonus: true },
  { cardKey: "Business Blue Plus I--01117", cardType: "Business Blue Plus I", lastFive: "-01117", hasBonus: true },
  { cardKey: "Business Blue Plus I--01125", cardType: "Business Blue Plus I", lastFive: "-01125", hasBonus: true },
  { cardKey: "Business Blue Plus I--01141", cardType: "Business Blue Plus I", lastFive: "-01141", hasBonus: true },
  { cardKey: "Business Blue Plus I--01158", cardType: "Business Blue Plus I", lastFive: "-01158", hasBonus: true },

  // Business Blue Plus II cards - sorted by last five digits in ascending order
  { cardKey: "Business Blue Plus II--11017", cardType: "Business Blue Plus II", lastFive: "-11017", hasBonus: true },
  { cardKey: "Business Blue Plus II--11025", cardType: "Business Blue Plus II", lastFive: "-11025", hasBonus: true },
  { cardKey: "Business Blue Plus II--11033", cardType: "Business Blue Plus II", lastFive: "-11033", hasBonus: true },
  { cardKey: "Business Blue Plus II--11041", cardType: "Business Blue Plus II", lastFive: "-11041", hasBonus: false },
  { cardKey: "Business Blue Plus II--11058", cardType: "Business Blue Plus II", lastFive: "-11058", hasBonus: true },
  
  // Business Classic Gold cards - sorted by last five digits in ascending order
  { cardKey: "Business Classic Gold--71051", cardType: "Business Classic Gold", lastFive: "-71051", hasBonus: true },
  { cardKey: "Business Classic Gold--72067", cardType: "Business Classic Gold", lastFive: "-72067", hasBonus: true },
  { cardKey: "Business Classic Gold--72075", cardType: "Business Classic Gold", lastFive: "-72075", hasBonus: true },
  { cardKey: "Business Classic Gold--72083", cardType: "Business Classic Gold", lastFive: "-72083", hasBonus: true },
  { cardKey: "Business Classic Gold--72091", cardType: "Business Classic Gold", lastFive: "-72091", hasBonus: true },
  { cardKey: "Business Classic Gold--72109", cardType: "Business Classic Gold", lastFive: "-72109", hasBonus: true },
  { cardKey: "Business Classic Gold--72117", cardType: "Business Classic Gold", lastFive: "-72117", hasBonus: true },
  { cardKey: "Business Classic Gold--72125", cardType: "Business Classic Gold", lastFive: "-72125", hasBonus: true },
  { cardKey: "Business Classic Gold--72133", cardType: "Business Classic Gold", lastFive: "-72133", hasBonus: true },
  { cardKey: "Business Classic Gold--72141", cardType: "Business Classic Gold", lastFive: "-72141", hasBonus: true },
  { cardKey: "Business Classic Gold--72158", cardType: "Business Classic Gold", lastFive: "-72158", hasBonus: true },

  // Business Green cards - sorted by last five digits in ascending order
  { cardKey: "Business Green--81017", cardType: "Business Green", lastFive: "-81017", hasBonus: true },
  { cardKey: "Business Green--81025", cardType: "Business Green", lastFive: "-81025", hasBonus: true },
  { cardKey: "Business Green--81041", cardType: "Business Green", lastFive: "-81041", hasBonus: true },
  { cardKey: "Business Green--81058", cardType: "Business Green", lastFive: "-81058", hasBonus: true },

  // Business Platinum Card cards - sorted by last five digits in ascending order
  { cardKey: "Business Platinum Card--51017", cardType: "Business Platinum Card", lastFive: "-51017", hasBonus: true },
  { cardKey: "Business Platinum Card--51066", cardType: "Business Platinum Card", lastFive: "-51066", hasBonus: false },
  { cardKey: "Business Platinum Card--51074", cardType: "Business Platinum Card", lastFive: "-51074", hasBonus: true },
  { cardKey: "Business Platinum Card--51082", cardType: "Business Platinum Card", lastFive: "-51082", hasBonus: true },
  { cardKey: "Business Platinum Card--51090", cardType: "Business Platinum Card", lastFive: "-51090", hasBonus: true },
  { cardKey: "Business Platinum Card--51108", cardType: "Business Platinum Card", lastFive: "-51108", hasBonus: true },
  { cardKey: "Business Platinum Card--51116", cardType: "Business Platinum Card", lastFive: "-51116", hasBonus: true },
  { cardKey: "Business Platinum Card--52122", cardType: "Business Platinum Card", lastFive: "-52122", hasBonus: true },
  { cardKey: "Business Platinum Card--52130", cardType: "Business Platinum Card", lastFive: "-52130", hasBonus: true },
  { cardKey: "Business Platinum Card--52148", cardType: "Business Platinum Card", lastFive: "-52148", hasBonus: true },
  { cardKey: "Business Platinum Card--52155", cardType: "Business Platinum Card", lastFive: "-52155", hasBonus: true },
  { cardKey: "Business Platinum Card--52163", cardType: "Business Platinum Card", lastFive: "-52163", hasBonus: true },
  { cardKey: "Business Platinum Card--52171", cardType: "Business Platinum Card", lastFive: "-52171", hasBonus: true },
  { cardKey: "Business Platinum Card--52189", cardType: "Business Platinum Card", lastFive: "-52189", hasBonus: true },
  { cardKey: "Business Platinum Card--52197", cardType: "Business Platinum Card", lastFive: "-52197", hasBonus: true },
  { cardKey: "Business Platinum Card--52205", cardType: "Business Platinum Card", lastFive: "-52205", hasBonus: true },
  { cardKey: "Business Platinum Card--52213", cardType: "Business Platinum Card", lastFive: "-52213", hasBonus: true },
  { cardKey: "Business Platinum Card--52221", cardType: "Business Platinum Card", lastFive: "-52221", hasBonus: true },
  { cardKey: "Business Platinum Card--52239", cardType: "Business Platinum Card", lastFive: "-52239", hasBonus: true },
  { cardKey: "Business Platinum Card--52247", cardType: "Business Platinum Card", lastFive: "-52247", hasBonus: true },
  { cardKey: "Business Platinum Card--52254", cardType: "Business Platinum Card", lastFive: "-52254", hasBonus: true },

  // Business Rose Gold cards - sorted by last five digits in ascending order
  { cardKey: "Business Rose Gold--01018", cardType: "Business Rose Gold", lastFive: "-01018", hasBonus: true },
  { cardKey: "Business Rose Gold--01026", cardType: "Business Rose Gold", lastFive: "-01026", hasBonus: true },
  { cardKey: "Business Rose Gold--01034", cardType: "Business Rose Gold", lastFive: "-01034", hasBonus: true },
  { cardKey: "Business Rose Gold--01042", cardType: "Business Rose Gold", lastFive: "-01042", hasBonus: true },
  { cardKey: "Business Rose Gold--01059", cardType: "Business Rose Gold", lastFive: "-01059", hasBonus: true },
  { cardKey: "Business Rose Gold--01067", cardType: "Business Rose Gold", lastFive: "-01067", hasBonus: true },
  { cardKey: "Business Rose Gold--01075", cardType: "Business Rose Gold", lastFive: "-01075", hasBonus: true },
  { cardKey: "Business Rose Gold--01083", cardType: "Business Rose Gold", lastFive: "-01083", hasBonus: true },
  { cardKey: "Business Rose Gold--01091", cardType: "Business Rose Gold", lastFive: "-01091", hasBonus: true },
  { cardKey: "Business Rose Gold--01109", cardType: "Business Rose Gold", lastFive: "-01109", hasBonus: true },
  { cardKey: "Business Rose Gold--01117", cardType: "Business Rose Gold", lastFive: "-01117", hasBonus: true },
  { cardKey: "Business Rose Gold--01125", cardType: "Business Rose Gold", lastFive: "-01125", hasBonus: true },
  { cardKey: "Business Rose Gold--01133", cardType: "Business Rose Gold", lastFive: "-01133", hasBonus: true },
  { cardKey: "Business Rose Gold--01141", cardType: "Business Rose Gold", lastFive: "-01141", hasBonus: true },
  { cardKey: "Business Rose Gold--01158", cardType: "Business Rose Gold", lastFive: "-01158", hasBonus: true },
  { cardKey: "Business Rose Gold--01166", cardType: "Business Rose Gold", lastFive: "-01166", hasBonus: true },
  { cardKey: "Business Rose Gold--01174", cardType: "Business Rose Gold", lastFive: "-01174", hasBonus: true },
  { cardKey: "Business Rose Gold--01182", cardType: "Business Rose Gold", lastFive: "-01182", hasBonus: true },
  { cardKey: "Business Rose Gold--01190", cardType: "Business Rose Gold", lastFive: "-01190", hasBonus: true },
  { cardKey: "Business Rose Gold--01208", cardType: "Business Rose Gold", lastFive: "-01208", hasBonus: true },
  { cardKey: "Business Rose Gold--01216", cardType: "Business Rose Gold", lastFive: "-01216", hasBonus: true },
  { cardKey: "Business Rose Gold--01224", cardType: "Business Rose Gold", lastFive: "-01224", hasBonus: true },
  { cardKey: "Business Rose Gold--01232", cardType: "Business Rose Gold", lastFive: "-01232", hasBonus: true },
  { cardKey: "Business Rose Gold--01240", cardType: "Business Rose Gold", lastFive: "-01240", hasBonus: true },
  { cardKey: "Business Rose Gold--01257", cardType: "Business Rose Gold", lastFive: "-01257", hasBonus: true },
  { cardKey: "Business Rose Gold--01265", cardType: "Business Rose Gold", lastFive: "-01265", hasBonus: true },
  { cardKey: "Business Rose Gold--01273", cardType: "Business Rose Gold", lastFive: "-01273", hasBonus: true },
  { cardKey: "Business Rose Gold--01281", cardType: "Business Rose Gold", lastFive: "-01281", hasBonus: true },
  { cardKey: "Business Rose Gold--01299", cardType: "Business Rose Gold", lastFive: "-01299", hasBonus: true },
  { cardKey: "Business Rose Gold--01307", cardType: "Business Rose Gold", lastFive: "-01307", hasBonus: true },

  // Business White Gold cards - sorted by last five digits in ascending order
  { cardKey: "Business White Gold--41018", cardType: "Business White Gold", lastFive: "-41018", hasBonus: true },
  { cardKey: "Business White Gold--41026", cardType: "Business White Gold", lastFive: "-41026", hasBonus: true },
  { cardKey: "Business White Gold--41034", cardType: "Business White Gold", lastFive: "-41034", hasBonus: true },
  { cardKey: "Business White Gold--41042", cardType: "Business White Gold", lastFive: "-41042", hasBonus: true },
  { cardKey: "Business White Gold--41059", cardType: "Business White Gold", lastFive: "-41059", hasBonus: true },
]

// Function to update a card's bonus status
export const updateCardBonusStatus = (cardKey: string, hasBonus: boolean) => {
  const cardIndex = employeeCardBonuses.findIndex(card => card.cardKey === cardKey)
  if (cardIndex !== -1) {
    employeeCardBonuses[cardIndex].hasBonus = hasBonus
  }
}

// Function to get a card's bonus status
export const getCardBonusStatus = (cardKey: string): boolean => {
  const card = employeeCardBonuses.find(card => card.cardKey === cardKey)
  return card?.hasBonus || false
}

// Function to get all cards with bonus status
export const getAllCardBonuses = (): EmployeeCardBonus[] => {
  return [...employeeCardBonuses]
}

// Function to get count of cards with bonuses
export const getBonusCardCount = (): number => {
  return employeeCardBonuses.filter(card => card.hasBonus).length
}
