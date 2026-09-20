import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { AiResponseLoading } from "@/src/features/soulFlower/components/AiResponseLoading";
import { ChoiceOptionRow } from "@/src/features/soulFlower/components/ChoiceOptionRow";
import { QuestionAiChatEntry } from "@/src/features/soulFlower/components/QuestionAiChatEntry";
import {
  AI_ACCENT_COLOR,
  APP_TEXT_COLOR,
} from "@/src/features/soulFlower/constants";
import type {
  Question,
  SubmitAnswerResponse,
  TodayAnswerResult,
} from "@/src/features/soulFlower/types";

type FormPhase = "idle" | "loading" | "result";

interface AiResult {
  summary: string;
  explain: string;
}

interface QuestionFormProps {
  question: Question;
  onSubmit: (answerContent: string) => Promise<SubmitAnswerResponse | null>;
  /** 传入时直接进入 result 状态，用于查看今日答题结果 */
  initialResult?: TodayAnswerResult;
  /** 进入一对一聊天后关闭外层觉察弹窗 */
  onLeaveForChat?: () => void | Promise<void>;
}

const PLACEHOLDER_COLOR = "#9CA3AF";
const PRIMARY_COLOR = "#7B6CF9";
const ACTION_LINK_TOP_GAP = 24;

function buildInitialAnswerState(
  question: Question,
  initialResult?: TodayAnswerResult,
) {
  if (!initialResult) {
    return {
      selectedOption: null as string | null,
      textAnswer: "",
      phase: "idle" as FormPhase,
      aiResult: null as AiResult | null,
      answerId: null as string | null,
    };
  }

  return {
    selectedOption:
      question.type === "singleChoice" ? initialResult.answerContent : null,
    textAnswer: question.type === "text" ? initialResult.answerContent : "",
    phase: "result" as FormPhase,
    aiResult: {
      summary: initialResult.summary,
      explain: initialResult.explain,
    },
    answerId: initialResult.id ?? null,
  };
}

export function QuestionForm({
  question,
  onSubmit,
  initialResult,
  onLeaveForChat,
}: QuestionFormProps) {
  const initialState = buildInitialAnswerState(question, initialResult);
  const [selectedOption, setSelectedOption] = useState<string | null>(
    initialState.selectedOption,
  );
  const [textAnswer, setTextAnswer] = useState(initialState.textAnswer);
  const [phase, setPhase] = useState<FormPhase>(initialState.phase);
  const [aiResult, setAiResult] = useState<AiResult | null>(initialState.aiResult);
  const [answerId, setAnswerId] = useState<string | null>(initialState.answerId);

  const isLocked = phase !== "idle";

  const handleSubmit = useCallback(async () => {
    const answerContent =
      question.type === "singleChoice" ? (selectedOption ?? "") : textAnswer;

    setPhase("loading");
    try {
      const result = await onSubmit(answerContent);
      if (!result || result.success === false) {
        setPhase("idle");
        return;
      }
      setAiResult({
        summary: result.summary ?? "",
        explain: result.explain ?? "",
      });
      if (result.id) {
        setAnswerId(result.id);
      }
      setPhase("result");
    } catch {
      setPhase("idle");
    }
  }, [onSubmit, question.type, selectedOption, textAnswer]);

  return (
    <View style={styles.container}>
      {question.flowerName ? (
        <Text style={styles.flowerName}>{question.flowerName}</Text>
      ) : null}
      {question.categoryName ? (
        <Text style={styles.categoryName}>{question.categoryName}</Text>
      ) : null}
      <Text style={styles.title}>{question.title}</Text>

      {question.type === "singleChoice" ? (
        <View style={styles.options}>
          {(question.options ?? []).map((option) => (
            <ChoiceOptionRow
              key={option}
              label={option}
              selected={selectedOption === option}
              disabled={isLocked}
              onPress={() => setSelectedOption(option)}
            />
          ))}
        </View>
      ) : (
        <TextInput
          style={styles.textInput}
          value={textAnswer}
          onChangeText={setTextAnswer}
          placeholder="写下你此刻的觉察..."
          placeholderTextColor={PLACEHOLDER_COLOR}
          multiline
          textAlignVertical="top"
          editable={!isLocked}
        />
      )}

      {phase === "idle" ? (
        <Pressable style={styles.submitLinkWrap} onPress={handleSubmit}>
          <Text style={styles.submitLink}>解读</Text>
        </Pressable>
      ) : null}

      {phase === "loading" || phase === "result" ? (
        <View style={styles.aiSection}>
          <Text style={styles.aiLabel}>AI的回应</Text>
          {phase === "loading" ? <AiResponseLoading /> : null}
          {phase === "result" && aiResult ? (
            <View style={styles.resultBlock}>
              <Text style={styles.summary}>{aiResult.summary}</Text>
              <Text style={styles.explain}>{aiResult.explain}</Text>
              <View style={styles.actionLinks}>
                <QuestionAiChatEntry answerId={answerId} onOpened={onLeaveForChat} />
                <Text style={styles.actionLink}>AI众议厅→</Text>
              </View>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  flowerName: {
    fontSize: 13,
    fontWeight: "600",
    color: PRIMARY_COLOR,
  },
  categoryName: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: -6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: APP_TEXT_COLOR,
    lineHeight: 26,
  },
  options: {
    marginTop: 4,
  },
  textInput: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: APP_TEXT_COLOR,
    backgroundColor: "#FAFAFA",
  },
  submitLinkWrap: {
    alignSelf: "flex-end",
    marginTop: 8,
    paddingVertical: 4,
  },
  submitLink: {
    fontSize: 13,
    color: AI_ACCENT_COLOR,
    textDecorationLine: "underline",
  },
  aiSection: {
    marginTop: 8,
  },
  aiLabel: {
    fontSize: 13,
    color: AI_ACCENT_COLOR,
    alignSelf: "flex-start",
  },
  resultBlock: {
    marginTop: 8,
    gap: 12,
  },
  summary: {
    fontSize: 17,
    lineHeight: 26,
    color: AI_ACCENT_COLOR,
  },
  explain: {
    fontSize: 15,
    lineHeight: 24,
    color: APP_TEXT_COLOR,
  },
  actionLinks: {
    marginTop: ACTION_LINK_TOP_GAP,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  actionLink: {
    fontSize: 13,
    color: AI_ACCENT_COLOR,
    textDecorationLine: "underline",
  },
});
