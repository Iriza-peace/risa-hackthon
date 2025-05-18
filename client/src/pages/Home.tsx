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

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tab, setTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleCategoryClick = (categoryId: number) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const handleFilterClick = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  // Updated sorting here — using ticket_id for "Newest" tab
  const filteredComplaints = tickets
    .filter((complaint) =>
      selectedCategory ? complaint.category_id === selectedCategory : true
    )
    .sort((a, b) => {
      if (tab === 0) return b.upvotes - a.upvotes;           // Trending by upvotes
      if (tab === 1) return b.ticket_id - a.ticket_id;       // Newest by ticket_id (fallback)
      return b.upvotes - a.upvotes;
    });

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch("http://localhost:5000/api/tickets");
        const data = await res.json();
        setTickets(data);
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchCategories() {
      try {
        const res = await fetch("http://localhost:5000/api/categories");
        const data = await res.json();
        setCategories(data);
        console.log("categories:", data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    }

    fetchTickets();
    fetchCategories();
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

          <Menu anchorEl={anchorEl} open={open} onClose={handleFilterClose}>
            <MenuItem onClick={handleFilterClose}>All Statuses</MenuItem>
            <MenuItem onClick={handleFilterClose}>Received</MenuItem>
          </Menu>
        </Box>

        {!isMobile && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {categories.map((category) => (
              <Chip
                key={category.category_id}
                label={category.category_title}
                onClick={() => handleCategoryClick(category.category_id)}
                sx={{
                  bgcolor:
                    selectedCategory === category.category_id
                      ? "primary.main"
                      : "rgba(0, 0, 0, 0.08)",
                  color:
                    selectedCategory === category.category_id
                      ? "white"
                      : "text.primary",
                  "&:hover": {
                    bgcolor:
                      selectedCategory === category.category_id
                        ? "primary.dark"
                        : "rgba(0, 0, 0, 0.12)",
                  },
                }}
              />
            ))}
          </Box>
        )}

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tab} onChange={handleTabChange}>
            <Tab icon={<TrendingUp size={16} />} label="Trending" iconPosition="start" />
            <Tab icon={<Clock size={16} />} label="Newest" iconPosition="start" />
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
        {/* Sidebar content omitted for brevity, same as before */}
      </Grid>
    </Grid>
  );
};

export default Home;
