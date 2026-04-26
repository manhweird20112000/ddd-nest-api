import { BaseUseCase } from '@/shared/common/base-use-case';
import { LLMPort } from '../../domain/ports/llm.port';
import { DataSource } from 'typeorm';

interface Input {
  question: string;
}

/**
 * Sanitizes raw SQL string from LLM output (removes markdown code blocks, trims).
 */
function sanitizeSql(rawSql: string): string {
  let sql = rawSql.trim();
  const codeBlockMatch = sql.match(/```(?:sql)?\s*([\s\S]*?)```/i);
  if (codeBlockMatch) {
    sql = codeBlockMatch[1].trim();
  }
  return sql;
}

export class ExecuteSqlChatUseCase implements BaseUseCase<Input, any> {
  constructor(
    private readonly llmPort: LLMPort,
    private readonly dataSource: DataSource,
  ) {}

  async execute(input: Input): Promise<any> {
    const prompt = `
        You are a SQL expert.
        You are given a question and a database schema.
        Database schema:

        admins(id, name, email, status, created_at, updated_at, delete_at, created_by, deleted_by)
        roles(id, name, description, created_at, updated_at, delete_at)
        permissions(id, resource, action, description, created_at, updated_at, delete_at)
        admin_roles(admin_id, role_id)
        role_permissions(role_id, permission_id)

        You need to generate the SQL query to answer the question.
        Return only the SQL query not in code block, no other text.
        Question:
        ${input.question}
        `;
    const rawSql = await this.llmPort.chat(prompt);
    const sql = sanitizeSql(rawSql);
    let result: Record<string, unknown> = {};
    if (!sql.toLowerCase().trimStart().startsWith('select')) {
      result.error = 'Not permission';
    } else {
      try {
        const rows = await this.dataSource.query(sql);
        result = rows;
      } catch (error) {
        result.error = error instanceof Error ? error.message : 'Query failed';
      }
    }

    const promptAnswer = `
        You are an assistant that explains database query results.

        User question:
        ${input.question}

        SQL query:
        ${sql}

        Query result:
        ${JSON.stringify(result)}

        Answer naturally interesting.
    `;

    return this.llmPort.chat(promptAnswer);
  }
}
