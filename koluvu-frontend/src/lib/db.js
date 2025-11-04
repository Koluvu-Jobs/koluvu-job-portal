// src/lib/db.js

import supabase from "./supabaseClient.js";

/**
 * Execute a PostgreSQL query using Supabase
 * This function provides a PostgreSQL-compatible interface for Supabase queries
 *
 * @param {string} queryText - The SQL query string with $1, $2, etc. placeholders
 * @param {Array} params - Array of parameters to replace placeholders
 * @returns {Promise<{rows: Array}>} - Result object with rows array
 */
export async function query(queryText, params = []) {
  try {
    // Convert PostgreSQL-style query to Supabase format
    let supabaseQuery = queryText;

    // Replace PostgreSQL parameter placeholders ($1, $2, etc.) with actual values
    if (params && params.length > 0) {
      params.forEach((param, index) => {
        const placeholder = `$${index + 1}`;
        supabaseQuery = supabaseQuery.replace(
          new RegExp(`\\${placeholder}`, "g"),
          typeof param === "string" ? `'${param}'` : param
        );
      });
    }

    // Execute the query using Supabase's RPC (Remote Procedure Call)
    // Note: This is a simplified approach. In production, you'd want to use proper Supabase queries
    const { data, error } = await supabase.rpc("execute_sql", {
      query: supabaseQuery,
    });

    if (error) {
      throw error;
    }

    return { rows: data || [] };
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

/**
 * Alternative query function for common Supabase operations
 * This provides a more Supabase-native approach
 */
export class DatabaseService {
  // Interview Scripts
  static async getInterviewScript(scriptId) {
    try {
      const { data, error } = await supabase
        .from("interview_scripts")
        .select(
          `
          *,
          mock_interview_setups!inner(
            name,
            role,
            experience,
            interview_types,
            skills
          )
        `
        )
        .eq("id", scriptId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching interview script:", error);
      return null;
    }
  }

  // Mock Interview Sessions
  static async updateSessionStatus(sessionId, status) {
    try {
      const { data, error } = await supabase
        .from("mock_interview_sessions")
        .update({
          session_status: status,
          completed_at: new Date().toISOString(),
        })
        .eq("id", sessionId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating session status:", error);
      throw error;
    }
  }

  // Jobs
  static async getAllJobs() {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "Active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return [];
    }
  }

  static async createJob(jobData) {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .insert([jobData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating job:", error);
      throw error;
    }
  }
}

// For backward compatibility, export the main query function as default
export default { query };
