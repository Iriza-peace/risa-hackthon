import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  InputBase,
  Paper,
  Chip,
  IconButton,
  Divider,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Search as SearchIcon,
  Filter as FilterIcon,
  TrendingUp,
  Clock,
} from "lucide-react";
import ComplaintCard from "../components/ComplaintCard";
import { CATEGORIES } from "../utils/mockData"; // Assuming you still need CATEGORIES

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tab, setTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleFilterClick = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const filteredComplaints = tickets // Use the fetched tickets
    .filter((complaint) =>
      selectedCategory ? complaint.ticket_module === selectedCategory : true
    ) // Assuming 'ticket_module' maps to your categories
    .sort((a, b) => {
      if (tab === 0) {
        // Trending (based on upvotes)
        return b.upvotes - a.upvotes;
      } else if (tab === 1) {
        // Newest (based on ticket_id - assuming higher ID is newer, adjust if you have a createdAt)
        return b.ticket_id - a.ticket_id;
      } else {
        // Most upvoted
        return b.upvotes - a.upvotes;
      }
    });

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch("http://localhost:5000/api/tickets");
        const data = await res.json();
        setTickets(data);
      } catch (error) {
        console.error("Failed to fetch tickets", error);
        // Optionally set an error state here
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);

  if (loading) {
    return <div>Loading issues...</div>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
            Community Issues
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and engage with issues reported by citizens in your community
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <IconButton sx={{ p: "10px" }} aria-label="search">
              <SearchIcon size={20} />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search issues..."
              inputProps={{ "aria-label": "search issues" }}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton
              sx={{ p: "10px" }}
              aria-label="filter"
              onClick={handleFilterClick}
            >
              <FilterIcon size={20} />
            </IconButton>
          </Paper>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleFilterClose}
            MenuListProps={{
              "aria-labelledby": "filter-button",
            }}
          >
            <MenuItem onClick={handleFilterClose}>All Statuses</MenuItem>
            <MenuItem onClick={handleFilterClose}>Received</MenuItem>{" "}
            {/* Update with your actual statuses */}
            {/* Add other status filters based on your API data */}
          </Menu>
        </Box>

        {!isMobile && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {CATEGORIES.map((category) => (
              <Chip
                key={category.value}
                label={category.label}
                onClick={() => handleCategoryClick(category.value)}
                sx={{
                  bgcolor:
                    selectedCategory === category.value
                      ? "primary.main"
                      : "rgba(0, 0, 0, 0.08)",
                  color:
                    selectedCategory === category.value
                      ? "white"
                      : "text.primary",
                  "&:hover": {
                    bgcolor:
                      selectedCategory === category.value
                        ? "primary.dark"
                        : "rgba(0, 0, 0, 0.12)",
                  },
                }}
              />
            ))}
          </Box>
        )}

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            aria-label="complaint tabs"
          >
            <Tab
              icon={<TrendingUp size={16} />}
              label="Trending"
              iconPosition="start"
              sx={{
                textTransform: "none",
                fontWeight: tab === 0 ? "bold" : "normal",
              }}
            />
            <Tab
              icon={<Clock size={16} />}
              label="Newest"
              iconPosition="start"
              sx={{
                textTransform: "none",
                fontWeight: tab === 1 ? "bold" : "normal",
              }}
            />
          </Tabs>
        </Box>

        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint) => (
            <ComplaintCard key={complaint.ticket_id} complaint={complaint} />
          ))
        ) : (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              No issues found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try changing your filters or search query
            </Typography>
          </Box>
        )}
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            mb: 3,
            bgcolor: "primary.main",
            color: "white",
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Make Your Voice Heard
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Report issues in your community and help make it a better place for
            everyone.
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
            Join 1,234 active citizens making a difference today.
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Recent Updates
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="medium">
              Road Maintenance Schedule
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The city has published the road maintenance schedule for the next
              3 months.
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="medium">
              Water Service Interruption
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Planned water service interruption in Downtown area on May 15th,
              8AM-2PM.
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="subtitle2" fontWeight="medium">
              Community Meeting
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join us for the monthly community meeting on May 20th at the City
              Hall.
            </Typography>
          </Box>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Issue Categories
          </Typography>
          {CATEGORIES.slice(0, 5).map((category, index) => (
            <Box key={category.value} sx={{ mb: index < 4 ? 2 : 0 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography variant="body2" fontWeight="medium">
                  {category.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.floor(Math.random() * 50) + 10}
                </Typography>
              </Box>
              <Box
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "rgba(0, 0, 0, 0.08)",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${Math.floor(Math.random() * 80) + 20}%`,
                    bgcolor: "primary.main",
                    borderRadius: 3,
                  }}
                />
              </Box>
            </Box>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Home;
