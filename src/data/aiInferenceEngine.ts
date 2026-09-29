import { AISettings } from './aiSettings';
import { CountryNewsAndStocks, NewsItem, StockItem, getCountryNewsAndStocks } from './countryNewsAndStocks';

/**
 * Executes a direct request to OpenAI-compatible or Anthropic-compatible API endpoints
 * to retrieve real-time news and stock market telemetry for any country around the globe.
 */
export async function fetchAiCountryNewsAndStocks(
  countryId: string,
  countryName: string,
  settings: AISettings
): Promise<CountryNewsAndStocks> {
  const { provider, baseUrl, apiKey, model } = settings;

  // Fallback / SIMULATION mode if no API key is provided
  if (!apiKey || apiKey.trim() === '' || provider === 'SIMULATION') {
    // Return enhanced dynamic news and stock data derived from local high-tech engine
    return getCountryNewsAndStocks(countryId, countryName);
  }

  const prompt = `You are a real-time global economic and security news feed. Provide the top 5 breaking news headlines and market stock movements for ${countryName} (${countryId}).
Return STRICT JSON ONLY matching this structure:
{
  "news": [
    {
      "id": "1",
      "headline": "Headline 1",
      "source": "REUTERS",
      "timeAgo": "5m ago",
      "category": "FINANCE",
      "impact": "HIGH"
    }, ... (exactly 5 items, category must be one of POLITICS, TECH, FINANCE, ENERGY, DEFENSE, MARKETS; impact must be HIGH, MEDIUM, or LOW)
  ],
  "gainers": [
    {
      "ticker": "SYMBOL1",
      "name": "Company Name 1",
      "price": "$120.50",
      "change": "+$5.20",
      "changePercent": 4.5
    }, ... (exactly 5 items for top growing gainers with positive changePercent)
  ],
  "losers": [
    {
      "ticker": "SYMBOL2",
      "name": "Company Name 2",
      "price": "$45.10",
      "change": "-$3.80",
      "changePercent": -7.8
    }, ... (exactly 5 items for top declining losers with negative changePercent)
  ]
}`;

  try {
    let jsonString = '';

    if (provider === 'ANTHROPIC') {
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      const endpoint = cleanBaseUrl.endsWith('/v1/messages') ? cleanBaseUrl : `${cleanBaseUrl}/v1/messages`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: model || 'claude-3-5-sonnet-20241022',
          max_tokens: 1200,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Anthropic API error (${response.status}): ${errorText}`);
      }

      const resData = await response.json();
      jsonString = resData.content?.[0]?.text || '';
    } else {
      // Default to OpenAI / OpenAI-compatible endpoint (supports vLLM, Ollama, LMStudio, OpenAI, Groq, Together, etc.)
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      const endpoint = cleanBaseUrl.endsWith('/chat/completions') ? cleanBaseUrl : `${cleanBaseUrl}/chat/completions`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an AI economic intelligence terminal returning strict raw JSON.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI-compatible API error (${response.status}): ${errorText}`);
      }

      const resData = await response.json();
      jsonString = resData.choices?.[0]?.message?.content || '';
    }

    // Clean JSON response (strip backticks if returned)
    const sanitizedJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(sanitizedJson);

    if (parsedData.news && parsedData.gainers && parsedData.losers) {
      return {
        news: parsedData.news.slice(0, 5),
        gainers: parsedData.gainers.slice(0, 5),
        losers: parsedData.losers.slice(0, 5)
      };
    }
  } catch (err) {
    console.warn('AI Gateway inference call failed, using fallback data:', err);
  }

  // Safe fallback if network/parsing error occurs
  return getCountryNewsAndStocks(countryId, countryName);
}

/**
 * Sends a conversation message to the configured AI Inference Gateway (OpenAI or Anthropic compatible).
 */
export async function sendAiChatMessage(
  userMessage: string,
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  activeCountryName: string,
  settings: AISettings
): Promise<string> {
  const { provider, baseUrl, apiKey, model } = settings;

  // Fallback / SIMULATION mode if no API key is provided
  if (!apiKey || apiKey.trim() === '' || provider === 'SIMULATION') {
    await new Promise((res) => setTimeout(res, 600));

    const lower = userMessage.toLowerCase();
    if (lower.includes('news') || lower.includes('headline')) {
      return `[SIMULATED AI INTELLIGENCE] Top intelligence reports for ${activeCountryName}: Economic expansion detected in quantum sector, energy infrastructure upgrades ongoing, and tech market inflows remain high (+6.4%).`;
    }
    if (lower.includes('stock') || lower.includes('market') || lower.includes('gainer') || lower.includes('loser')) {
      return `[SIMULATED AI INTELLIGENCE] Market telemetry for ${activeCountryName}: Tech leaders (+8.2%) and semiconductor stocks are driving current index gains. Financial and defense tickers remain stable.`;
    }
    if (lower.includes('sat') || lower.includes('grid') || lower.includes('defense') || lower.includes('radar')) {
      return `[SIMULATED AI INTELLIGENCE] Tactical status for ${activeCountryName}: Satellite constellation operational (Level 3 Defense). Orbital uplink latency at 12ms with 98.4% signal fidelity.`;
    }

    return `[SIMULATED AI INTELLIGENCE Node "${settings.aiName}"] Telemetry received for target sector [${activeCountryName}]. Query processed: "${userMessage}". Systems nominal across all 12 defense nodes.`;
  }

  const systemPrompt = `You are BROADCAST HUD Tactical AI Assistant (${settings.aiName}).
You are embedded inside a high-tech global intelligence dashboard monitoring target country: ${activeCountryName}.
Provide concise, clear, and actionable intelligence, news summaries, and market stock insights for the user's queries. Keep responses under 120 words and format key data cleanly.`;

  try {
    if (provider === 'ANTHROPIC') {
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      const endpoint = cleanBaseUrl.endsWith('/v1/messages') ? cleanBaseUrl : `${cleanBaseUrl}/v1/messages`;

      const formattedMessages = [
        ...chatHistory.map((msg) => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: userMessage }
      ];

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: model || 'claude-3-5-sonnet-20241022',
          max_tokens: 600,
          system: systemPrompt,
          messages: formattedMessages
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Anthropic API error (${response.status}): ${errorText}`);
      }

      const resData = await response.json();
      return resData.content?.[0]?.text || 'No response returned from AI gateway.';
    } else {
      // OpenAI / OpenAI-compatible endpoint
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      const endpoint = cleanBaseUrl.endsWith('/chat/completions') ? cleanBaseUrl : `${cleanBaseUrl}/chat/completions`;

      const formattedMessages = [
        { role: 'system', content: systemPrompt },
        ...chatHistory.map((msg) => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: userMessage }
      ];

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model || 'gpt-4o-mini',
          messages: formattedMessages,
          max_tokens: 600,
          temperature: 0.5
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
      }

      const resData = await response.json();
      return resData.choices?.[0]?.message?.content || 'No response returned from AI gateway.';
    }
  } catch (err: any) {
    console.error('AI Chat error:', err);
    return `[AI GATEWAY ERROR] Could not reach endpoint (${err.message || 'Network failure'}). Check Settings configuration.`;
  }
}

