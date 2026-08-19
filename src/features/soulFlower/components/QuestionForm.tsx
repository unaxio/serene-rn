import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { AiResponseLoading } from "@/src/features/soulFlower/components/AiResponseLoading";
import { ChoiceOptionRow } from "@/src/features/soulFlower/components/ChoiceOptionRow";
import {
  AI_ACCENT_COLOR,
  APP_TEXT_COLOR,
} from "@/src/features/soulFlower/constants";
import type {
  Question,
  SubmitAnswerResponse,
} from "@/src/features/soulFlower/types";

type FormPhase = "idle" | "loading" | "result";

interface AiResult {
  summary: string;
  explain: string;
}

interface QuestionFormProps {
  question: Question;
  onSubmit: (answerContent: string) => Promise<SubmitAnswerResponse | null>;
  onBack?: () => void;
}

const PLACEHOLDER_COLOR = "#9CA3AF";
const PRIMARY_COLOR = "#2F95DC";
const RETURN_TOP_GAP = 48;

export function QuestionForm({
  question,
  onSubmit,
  onBack,
}: QuestionFormProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [phase, setPhase] = useState<FormPhase>("idle");
  const [aiResult, setAiResult] = useState<AiResult | null>(null);

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
      setPhase("result");
    } catch {
      setPhase("idle");
    }
  }, [onSubmit, question.type, selectedOption, textAnswer]);

  const handleBack = useCallback(() => {
    onBack?.();
  }, [onBack]);

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
              <Pressable style={styles.backLinkWrap} onPress={handleBack}>
                <Text style={styles.backLink}>返回</Text>
              </Pressable>
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
  backLinkWrap: {
    alignSelf: "flex-start",
    marginTop: RETURN_TOP_GAP,
    paddingVertical: 4,
  },
  backLink: {
    fontSize: 13,
    color: AI_ACCENT_COLOR,
    textDecorationLine: "underline",
  },
});
