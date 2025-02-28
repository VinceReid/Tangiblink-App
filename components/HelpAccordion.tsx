import { LucideIcon } from "@/components/LucideIcons";
import { Accordion, Paragraph, Square, Theme } from "tamagui";
//  import the helpItems.json file
import { HelpItems } from "@/constants/helpItems";

interface HelpItem {
  title: string;
  info: JSX.Element;
}

export function HelpAccordion() {
  return (
    <Accordion overflow="hidden" type="multiple">
      {HelpItems.map((item: HelpItem, index: number) => (
        <Accordion.Item key={index} value={index.toString()}>
          <Accordion.Trigger flexDirection="row" justifyContent="space-between">
            {({ open }: { open: boolean }) => (
              <>
                <Paragraph>{item.title}</Paragraph>
                <Square animation="quick" rotate={open ? "180deg" : "0deg"}>
                  <LucideIcon defaultIcon="chevronDown" size="$1" />
                </Square>
              </>
            )}
          </Accordion.Trigger>
          <Accordion.HeightAnimator>
            <Theme name={"accent"}>
              <Accordion.Content exitStyle={{ opacity: 0 }} bg={"$background"}>
                {item.info}
              </Accordion.Content>
            </Theme>
          </Accordion.HeightAnimator>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
