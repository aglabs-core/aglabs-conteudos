import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

// Fonte: vault, 01 - Empresa/Políticas Comerciais e de Suporte.md
// versão de1d0c3bb8be8215dc651ded42f3d6264aa4cb51: (64) 99325-9857.
// Só o destino incorreto de atendimento é proibido; números de lembretes
// específicos de produtos não devem ser normalizados para o da Maia.
for (const file of readdirSync(".", { recursive: true }).filter((file) =>
  file.endsWith(".html") && !file.startsWith(".git/"))) {
  test(`destinos públicos aprovados: ${file}`, () => {
    const html = readFileSync(file, "utf8");
    assert.doesNotMatch(html, /https?:\/\/(?:www\.)?aglabs\.com\.br\/automacoes\b/i);
    assert.doesNotMatch(html, /(?:wa\.me\/|api\.whatsapp\.com\/send\?phone=)556493259857\b/);
    if (file === "conteudos/ausencia/index.html") {
      assert.match(html, /href="https:\/\/wa\.me\/5564993259857"/);
    }
  });
}
