import mongoose, { Schema, model, models, Document } from "mongoose";

// ---------------- User ----------------
export interface IUser extends Document {
  name: string;
  password: string;
  lastLogin?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", UserSchema);


// ---------------- Employee ----------------
export interface IEmployee {
  _id: string;
  employee_name: string;
  department: string;
  keyboard_id?: string;
  mouse_id?: string;
  pc_id?: string;
  heatset_id?: string;
  laptop_id?: string;
  mouse_status?: string;
  keyboard_status?: string;
  pc_status?: string;
  heatset_status?: string;
  laptop_status?: string;
  phone_status?: string;
  phone_id?: string;
  status?: string;
  employment_type: "Temporary" | "Permanent";
  temp_end_date?: string;
  createdAt?: Date;
  updatedAt?: Date;

}

const EmployeeSchema = new Schema<IEmployee>(
  {
    _id: { type: String, required: true },
    employee_name: { type: String, required: true },
    department: { type: String, required: true },
    keyboard_id: { type: String, ref: "Keyboard", required: false },
    mouse_id: { type: String, ref: "Mouse", required: false },
    pc_id: { type: String, ref: "Pc", required: false },
    heatset_id: { type: String, ref: "heatset", required: false },
    laptop_id: { type: String, ref: "Laptop", required: false },
    phone_id: { type: String, ref: "Phone", required: false },
    mouse_status: { type: String, enum: ["STORE", "USED", "REPAIR"], default: "STORE" },
    keyboard_status: { type: String, enum: ["STORE", "USED", "REPAIR"], default: "STORE" },
    pc_status: { type: String, enum: ["STORE", "USED", "REPAIR"], default: "STORE" },
    heatset_status: { type: String, enum: ["STORE", "USED", "REPAIR"], default: "STORE" },
    laptop_status: { type: String, enum: ["STORE", "USED", "REPAIR"], default: "STORE" },
    phone_status: { type: String, enum: ["STORE", "USED", "REPAIR"], default: "STORE" },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"], 
      default: "ACTIVE",
    },
    employment_type: {
      type: String,
      enum: ["Temporary", "Permanent"],
      default: "Permanent",
      required: true,
    },
    temp_end_date: { type: Date, required: false },

  },
  { timestamps: true }
);

export const Employee = models.Employee || model<IEmployee>("Employee", EmployeeSchema, "employee");

export interface AssignedEmployee {
  _id: string;
  employee_name: string;
  department: string;
}


export interface IMouse {
  _id: string; // <-- string ID
  brand: string;
  model: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  assigned_to?: string | AssignedEmployee | null;
}

const MouseSchema = new Schema<IMouse>(
  {
    _id: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    status: { type: String, enum: ["STORE", "USED", "REPAIR"], default: "STORE" },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    assigned_to: { type: String, ref: "Employee" },
  },
  { timestamps: true }
);

export const Mouse = models.Mouse || model<IMouse>("Mouse", MouseSchema, "mouse_asset");

export interface IKeyboard {
  _id: string; // <-- string ID
  brand: string;
  model: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  assigned_to?: string | AssignedEmployee | null;
}

const KeyboardSchema = new Schema<IKeyboard>(
  {
    _id: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    status: { type: String, enum: ["STORE", "USED", "REPAIR"], default: "STORE" },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    assigned_to: { type: String, ref: "Employee", default: null },
  },

  { timestamps: true }
);

export const Keyboard = models.Keyboard || model<IKeyboard>("Keyboard", KeyboardSchema, "keyboard_asset");


export interface IHeatset {
  _id: string; // <-- string ID
  brand: string;
  model: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  assigned_to?: string | AssignedEmployee | null;
}

const heatsetSchema = new Schema<IHeatset>(
  {
    _id: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    status: { type: String, enum: ["STORE", "USED", "REPAIR"], default: "STORE" },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    assigned_to: { type: String, ref: "Employee", default: null },
  },

  { timestamps: true }
);

export const Heatset = models.Heatset || model<IHeatset>("Heatset", heatsetSchema, "heatset_asset");

export interface IPhone {
  _id: string; // <-- string ID
  brand: string;
  model: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  assigned_to?: string | AssignedEmployee | null;
}

const phoneSchema = new Schema<IPhone>(
  {
    _id: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    status: { type: String, enum: ["STORE", "USED", "REPAIR"], default: "STORE" },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    assigned_to: { type: String, ref: "Employee", default: null },
  },

  { timestamps: true }
);

export const Phone = models.Phone || model<IPhone>("Phone", phoneSchema, "phone_asset");

export interface IMonitor {
  _id: string; // <-- string ID
  brand: string;
  model: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  assigned_to?: string | AssignedEmployee | null;
}

const monitorSchema = new Schema<IMonitor>(
  {
    _id: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    status: { type: String, enum: ["STORE", "USED", "REPAIR"], default: "STORE" },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    assigned_to: { type: String, ref: "Employee", default: null },
  },

  { timestamps: true }
);

export const Monitor = models.Monitor || model<IMonitor>("Monitor", monitorSchema, "monitor_asset");

export interface IPc {
  _id: string; // <-- string ID
  brand: string;
  model: string;
  status: string;
  ram: string;
  ssd: string;
  gen: string;
  createdAt?: Date;
  updatedAt?: Date;
  assigned_to?: string | AssignedEmployee | null;
}

const PcSchema = new Schema<IPc>(
  {
    _id: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    status: { type: String, enum: ["STORE", "USED", "REPAIR"], default: "STORE" },
    ram: { type: String, required: true },
    ssd: { type: String, required: true },
    gen: { type: String, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    assigned_to: { type: String, ref: "Employee", default: null },
  },

  { timestamps: true }
);

export const Pc = models.Pc || model<IPc>("Pc", PcSchema, "pc_asset");

export interface ILaptop {
  _id: string; // <-- string ID
  brand: string;
  model: string;
  status: string;
  ram: string;
  ssd: string;
  gen: string;
  createdAt?: Date;
  updatedAt?: Date;
  assigned_to?: string | AssignedEmployee | null;
}

const LaptopSchema = new Schema<ILaptop>(
  {
    _id: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    status: { type: String, enum: ["STORE", "USED", "REPAIR"], default: "STORE" },
    ram: { type: String, required: true },
    ssd: { type: String, required: true },
    gen: { type: String, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    assigned_to: { type: String, ref: "Employee", default: null },
  },

  { timestamps: true }
);

export const Laptop = models.Laptop || model<ILaptop>("Laptop", LaptopSchema, "laptop_asset");
