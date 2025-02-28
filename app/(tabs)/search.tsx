import { Container } from "@/components/Container";
import { Content } from "@/components/Content";
import { SearchDomainsFlashList } from "@/components/SearchDomainFlashList";
export default function SearchScreen() {
  return (
    <Container>
      <Content>
        <SearchDomainsFlashList />
      </Content>
    </Container>
  );
}
