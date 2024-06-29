import Tabs from "../NavTabs/Tabs/Tabs";
import { StyledPanelNavTabs } from "./StyledPanelNavTabs";

const PanelNavTabs = ({
  value, labels, onChange,
}) => (
  <StyledPanelNavTabs>
    <Tabs
      className="tabs"
      tabs={labels}
      activeBarHeight="4px"
      value={value}
      onChange={(event, newValue) => {
        onChange(event, newValue);
      }}
    />
  </StyledPanelNavTabs>
);

export default PanelNavTabs