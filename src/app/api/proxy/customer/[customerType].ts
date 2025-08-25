import type { NextApiRequest, NextApiResponse } from "next";
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { customerType } = req.query; // cust1 or cust2
 
  try {
    const response = await fetch(`https://coss-ai4x.vercel.app/customers/${customerType}`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Proxy fetch error:", err);
    res.status(500).json({ error: "Failed to fetch" });
  }
}
 