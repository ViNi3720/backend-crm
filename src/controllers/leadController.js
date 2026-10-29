const pool = require("../config/db");

// ---------- 1. PUBLIC ENQUIRY FORM (no auth) ----------
const createLead = async (req, res) => {
  try {
    const { name, email, course_interest } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "name and email are required" });
    }

    const result = await pool.query(
      "INSERT INTO leads (name, email, course_interest) VALUES ($1, $2, $3) RETURNING *",
      [name, email, course_interest || null],
    );

    return res
      .status(201)
      .json({ message: "Enquiry submitted", lead: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------- 2. FETCH UNCLAIMED LEADS (auth) ----------
const getUnclaimedLeads = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM leads WHERE claimed_by IS NULL ORDER BY created_at DESC",
    );
    return res.json({ count: result.rows.length, leads: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------- 3. CLAIM A LEAD (auth) ----------
const claimLead = async (req, res) => {
  try {
    const leadId = parseInt(req.params.id, 10);
    const employeeId = req.user.id;

    if (Number.isNaN(leadId)) {
      return res.status(400).json({ message: "Invalid lead id" });
    }

    const result = await pool.query(
      "UPDATE leads SET claimed_by = $1 WHERE id = $2 AND claimed_by IS NULL RETURNING *",
      [employeeId, leadId],
    );

    if (result.rows.length === 0) {
      return res
        .status(409)
        .json({ message: "Lead not found or already claimed" });
    }

    return res.json({ message: "Lead claimed", lead: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------- 4. FETCH MY CLAIMED LEADS (auth) ----------
const getMyLeads = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM leads WHERE claimed_by = $1 ORDER BY created_at DESC",
      [req.user.id],
    );
    return res.json({ count: result.rows.length, leads: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createLead, getUnclaimedLeads, claimLead, getMyLeads };
