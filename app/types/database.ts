export interface Room {
  Room_Number: string;
  Room_Type: string;
  Block: string;
  Floor: string;
  is_occupied: boolean;
}

export interface Booking {
  ID: number;
  "Name of Guest": string;
  "Unit (only number)": string;
  "Mobile No": string;
  "WhatsApp No": string;
  "Room No": string;
  Check_in: string;
  Check_out: string;
  Purpose: string;
  Adults: number;
  Children: number;
  Status: string;
  Remarks: string;
}