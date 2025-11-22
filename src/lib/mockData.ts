import { ActivityLogEntry, LocationStock, Product } from "./types";

const now = () => new Date().toISOString();

const locations = (onHand: number, onOrder: number): LocationStock[] => [
  {
    locationId: "SALTY_TAILS",
    onHand: Math.floor(onHand * 0.4),
    onOrder: Math.floor(onOrder * 0.4)
  },
  {
    locationId: "CENTRAL_COAST",
    onHand: Math.floor(onHand * 0.4),
    onOrder: Math.floor(onOrder * 0.3)
  },
  {
    locationId: "CENTRAL_VALLEY",
    onHand: Math.floor(onHand * 0.2),
    onOrder: Math.floor(onOrder * 0.3)
  }
];

export const mockProducts: Product[] = [
  {
    id: "p1",
    faireId: "F-123",
    sku: "COWBOY-HAT-RED-OS",
    name: "Red Cowboy Hat",
    description: "Classic red cowboy hat with adjustable band.",
    imageUrl:
      "https://images.pexels.com/photos/1236788/pexels-photo-1236788.jpeg?auto=compress&cs=tinysrgb&w=400",
    vendorName: "Coastal Cowgirl Co.",
    category: "Accessories",
    tags: ["hat", "cowboy", "red"],
    onHandTotal: 12,
    onOrderTotal: 6,
    archived: false,
    locations: locations(12, 6),
    status: "NEEDS_REVIEW",
    missingFields: ["description"],
    notes: "",
    pushToSquare: false,
    pushToQuickBooks: false,
    pushToBooker: false,
    isSaltyTailsOnly: false,
    createdAt: now(),
    updatedAt: now()
  },
  {
    id: "p2",
    faireId: "F-456",
    sku: "SHARK-PLUSH-BLUE-12",
    name: "Blue Shark Plush",
    description: "Soft plush shark – Salty Tails exclusive.",
    imageUrl:
      "https://images.pexels.com/photos/248409/pexels-photo-248409.jpeg?auto=compress&cs=tinysrgb&w=400",
    vendorName: "Salty Tails",
    category: "Toys",
    tags: ["shark", "plush", "kids"],
    onHandTotal: 5,
    onOrderTotal: 0,
    archived: false,
    locations: [
      {
        locationId: "SALTY_TAILS",
        onHand: 5,
        onOrder: 0
      },
      {
        locationId: "CENTRAL_COAST",
        onHand: 0,
        onOrder: 0
      },
      {
        locationId: "CENTRAL_VALLEY",
        onHand: 0,
        onOrder: 0
      }
    ],
    status: "VALIDATED",
    missingFields: [],
    notes: "Salty Tails only – do not send to Square.",
    pushToSquare: false,
    pushToQuickBooks: true,
    pushToBooker: true,
    isSaltyTailsOnly: true,
    createdAt: now(),
    updatedAt: now()
  },
  {
    id: "p3",
    sku: "FUDGE-ASSORTED-BOX",
    name: "Assorted Fudge Box",
    description: "",
    imageUrl: "",
    vendorName: "Hubbalicious Sweet Shoppe",
    category: "Food",
    tags: ["fudge", "assorted"],
    onHandTotal: 0,
    onOrderTotal: 24,
    archived: false,
    locations: locations(0, 24),
    status: "NEW",
    missingFields: ["description", "imageUrl"],
    notes: "",
    pushToSquare: false,
    pushToQuickBooks: false,
    pushToBooker: false,
    isSaltyTailsOnly: false,
    createdAt: now(),
    updatedAt: now()
  }
];

export const mockActivityLog: ActivityLogEntry[] = [
  {
    id: "log1",
    timestamp: now(),
    type: "IMPORT_FAIRE",
    message: "Imported 3 products from Faire.",
    payload: { count: 3 }
  },
  {
    id: "log2",
    timestamp: now(),
    type: "VALIDATE",
    message: "Validated Blue Shark Plush and pushed to QuickBooks + Booker.",
    productId: "p2"
  }
];
