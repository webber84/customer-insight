
import { GoogleGenAI, Type } from "@google/genai";
import { ClientProfile, InsightResponse, CorporateWiki, AppIntelligence, DynamicInfo, InfoHistoryEntry, VisitRecord, AppCKBProfile } from "../types";
import { MOCK_APP_CKB } from "../constants"; // 引入 Mock App 数据作为关联的 App 知识库

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * 基于历史记录生成该维度的综述总结
 */
export const summarizeCategoryHistory = async (categoryName: string, history: InfoHistoryEntry[]): Promise<string> => {
  if (history.length === 0) return "";
  
  const historyText = history.map(h => `[${h.date}] ${h.content}`).join('\n');
  const prompt = `
    你是一个资深的商业分析师。请针对客户基本情况中的“${categoryName}”维度，根据以下按时间排序的变更记录，总结出一份精炼、专业的现状综述。
    
    变更记录：
    ${historyText}

    输出要求：
    - 语言专业、简练（100字以内）。
    - 重点突出最新的变化和当前的核心状态。
    - 不要包含“综述如下”等废话，直接输出内容。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text?.trim() || "";
  } catch (e) {
    console.error("AI Summarization Error:", e);
    return history[0].content; // 降级处理：返回最新的一条记录内容
  }
};

/**
 * 从原始文本提取 8 个维度的客户基本信息
 */
export const extractCorporateBasicInfo = async (inputText: string): Promise<any> => {
  const prompt = `
    你是一个资深的商业分析师。请分析以下关于某广告主客户的描述文本，并将其提取为 8 个关键维度的结构化信息。
    描述文本：“${inputText}”

    提取维度：
    1. 发展历程 (history)
    2. 战略规划 (strategy)
    3. 产品布局 (productLayout)
    4. 经营情况 (businessStatus)
    5. 组织架构 (orgStructure)
    6. 预算分配 (budgetAllocation)
    7. 考核方式 (evaluationMethod)
    8. 归因方式 (attributionMethod)

    输出要求：
    - 严格的 JSON 格式。
    - 如果文本中未提到某个维度，请在该字段填入空字符串。
    - 语言简洁、专业。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            history: { type: Type.STRING },
            strategy: { type: Type.STRING },
            productLayout: { type: Type.STRING },
            businessStatus: { type: Type.STRING },
            orgStructure: { type: Type.STRING },
            budgetAllocation: { type: Type.STRING },
            evaluationMethod: { type: Type.STRING },
            attributionMethod: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text?.trim() || '{}');
  } catch (e) {
    console.error("AI Basic Info Extraction Error:", e);
    throw e;
  }
};

/**
 * AI 解析非结构化文本，更新或新增决策人字段
 */
export const parseDecisionMakerEdit = async (inputText: string): Promise<any> => {
  const prompt = `
    你是一个专业的数据抓取助手。请解析以下关于某公司决策人的描述文本，提取关键字段信息：
    描述文本：“${inputText}”

    提取规则：
    1. 姓名 (name): 提取人名。
    2. 职位 (title): 提取其最新职衔。
    3. 部门 (department): 提取所属部门。
    4. 角色 (role): 根据重要性判断为 "DECISION" (决策), "INFLUENCER" (建议者), "EXECUTION" (执行者)。
    5. 决策力 (decisionPower): 判断为 "HIGH" (高), "MEDIUM" (中), "LOW" (低)。默认 "MEDIUM"。
    6. 联系方式 (contact): 提取邮箱或电话。
    7. 负责业务 (responsibleBusiness): 仅从以下选项中选择（可多选）："推广", "预装", "Push", "联运"。
    8. 工作履历 (workExperience): 返回字符串数组。
    9. 教育背景 (education): 返回字符串数组。
    10. 备注 (remarks): 运营关注点。

    输出要求：严格的 JSON 格式。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            title: { type: Type.STRING },
            department: { type: Type.STRING },
            role: { type: Type.STRING, enum: ['DECISION', 'INFLUENCER', 'EXECUTION'] },
            decisionPower: { type: Type.STRING, enum: ['HIGH', 'MEDIUM', 'LOW'] },
            contact: { type: Type.STRING },
            responsibleBusiness: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING, enum: ['推广', '预装', 'Push', '联运'] } 
            },
            workExperience: { type: Type.ARRAY, items: { type: Type.STRING } },
            education: { type: Type.ARRAY, items: { type: Type.STRING } },
            remarks: { type: Type.STRING }
          },
          required: ['name', 'title', 'role', 'decisionPower', 'responsibleBusiness', 'workExperience', 'education', 'remarks']
        }
      }
    });

    return JSON.parse(response.text?.trim() || '{}');
  } catch (e) {
    console.error("AI Parse Error:", e);
    throw e;
  }
};

/**
 * 从会议纪要文本中提取会谈要点和遗留问题
 */
export const extractMeetingMinutes = async (minutesText: string): Promise<{ mainContent: string, issues: { description: string, owner: string }[] }> => {
  const prompt = `
    你是一个专业的会议秘书。请分析以下会议纪要文本，提取核心的“会谈要点”和“遗留问题”（Action Items）。

    会议纪要：
    “${minutesText}”

    提取规则：
    1. 会谈要点 (mainContent): 总结会议的核心讨论内容、达成的共识或关键信息。语言简练专业。
    2. 遗留问题 (issues): 提取所有需要后续跟进的任务。
       - 描述 (description): 任务的具体内容。
       - 责任人 (owner): 任务的负责人。如果文中未明确提及，请留空字符串。

    输出格式：
    请返回严格的 JSON 格式。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mainContent: { type: Type.STRING },
            issues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  owner: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text?.trim() || '{"mainContent": "", "issues": []}');
  } catch (e) {
    console.error("AI Meeting Minutes Extraction Error:", e);
    // Fallback: use raw text as content
    return { mainContent: minutesText, issues: [] };
  }
};

/**
 * 抓取公司全网实时新闻与动态
 */
export const fetchCompanyNews = async (companyName: string): Promise<DynamicInfo[]> => {
  const prompt = `搜索并汇总关于“${companyName}”公司的最新实时动态（过去 30 天内）。输出 JSON。`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json'
      }
    });
    return JSON.parse(response.text?.trim() || '[]');
  } catch (e) {
    return [];
  }
};

export const generateClientInsight = async (client: ClientProfile): Promise<InsightResponse> => {
  const prompt = `分析广告主 ${client.name} 的数据。输出 JSON：summary, actionItems, prediction。`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text?.trim() || '{}');
  } catch (e) {
    return { summary: "不可用", actionItems: [] };
  }
};

/**
 * 生成高层会晤策划报告
 */
export const generateVisitPlanningReport = async (visit: VisitRecord, client: ClientProfile): Promise<string> => {
  // 准备主宾信息：寻找决策力为 HIGH 或角色为 DECISION 的人
  const mainGuest = client.decisionTeam.find(m => m.decisionPower === 'HIGH' || m.role === 'DECISION') || client.decisionTeam[0];
  
  // 准备历史会晤数据
  const historyContext = client.visitHistory
    .filter(v => v.id !== visit.id) // 排除当前会晤（如果已存在）
    .slice(0, 3) // 最近3次
    .map(v => `时间：${v.date} | 内容：${v.mainContent} | 遗留问题数：${v.items.length}`)
    .join('\n');

  // 准备 App 数据 (模拟)
  const appContext = JSON.stringify({
    distributionHistory: MOCK_APP_CKB.distribution.history,
    retention: MOCK_APP_CKB.health.retention['7d'],
    uninstall: MOCK_APP_CKB.health.uninstall['7d']
  });

  const prompt = `
    你是一个专业的商务策划助手。请根据以下提供的客户信息、App数据和本次会晤信息，生成一份正式的《${client.name}高层会晤策划报告》。

    【输入数据】
    1. 本次会晤信息：
       - 时间：${visit.date}
       - 地点：${visit.location}
       - 标题：${visit.title}
       - 客户出席：${visit.clientParticipants?.join(', ')}
       - 我方出席：${visit.internalParticipants?.join(', ')}
       - 客户诉求：${visit.clientDemands}
       - 我方诉求：${visit.internalDemands}
    
    2. 主宾信息 (主决策人)：
       ${JSON.stringify(mainGuest)}

    3. 客户基本情况 (Knowledge Base)：
       ${JSON.stringify(client.corporateBasicInfo)}

    4. 财务与预算：
       年度预算：${client.financials.annualBudget}，YTD消耗：${client.financials.annualSpend}

    5. 历史会晤摘要 (最近3次)：
       ${historyContext}

    6. App 经营数据 (App Knowledge Base):
       ${appContext}
    
    7. 行程安排：
       ${JSON.stringify(visit.itinerary)}

    【报告模板要求】
    请严格按照以下 Markdown 格式输出（不要输出 Markdown 代码块标记，直接输出内容）：

    # ${client.name}高层会晤策划报告
    
    **时间：** ${visit.date}
    **地点：** ${visit.location}

    ## 1. 背景信息
    ### 1.1 主宾信息
    | 姓名 | 部门 | 职位 | 决策力 | 工作履历 | 教育经历 | 备注 |
    | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
    | [姓名] | [部门] | [职位] | [决策力] | [履历简述] | [教育简述] | [备注] |

    ### 1.2 客户主要出席人员
    [列出姓名和职位，如果输入中只有姓名，职位留空]

    ### 1.3 我方主要出席人员
    [列出姓名和职位]

    ### 1.4 历史会晤情况
    [总结最近的历史会晤核心内容及遗留问题]

    ## 2. 双方诉求及会谈要点
    **客户侧诉求：**
    [基于输入内容润色]

    **我方诉求：**
    [基于输入内容润色]

    ## 3. 客户基本情况
    [基于客户基本情况，总结战略、产品、组织架构等关键点]

    ## 4. 历史合作和经营分析
    **预算执行：** [基于财务数据分析预算消耗进度]
    **渠道分发：** [基于App数据分析分发份额趋势]
    **分发质量：** [基于App数据分析留存与卸载情况]

    ## 5. 行程安排
    [列出行程节点]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text?.trim() || "生成报告失败，请重试。";
  } catch (e) {
    console.error("Report Generation Error:", e);
    return "生成报告时发生错误。";
  }
};
