import { useEffect, useMemo, useState } from "react";
import Charts from "./Charts";
import { decode } from "html-entities"
import 'bootstrap/dist/css/bootstrap.min.css';
type Question = {
    difficulty: string;
    question: string;
    category: string;
}
export default function DataContainer() {
    const [data, setData] = useState<Question[]>([]);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [selectedChart, setSelectedChart] = useState<'pie' | 'bar'>('pie');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://opentdb.com/api.php?amount=50");
                if (!response.ok) throw new Error("api ne radi");
                const json = await response.json();
                setData(json.results);

            }
            catch (err: any) {
                setError(err.message);
                console.log(error);
            }
        }
        fetchData();

    }, [])
    const filteredData = useMemo(()=>{
        return data.filter(question => {
        const category = selectedCategory ? question.category == selectedCategory : true;
        const difficulty = selectedDifficulty ? question.difficulty == selectedDifficulty : true;
        return category && difficulty;
        });
    },[data,selectedCategory,selectedDifficulty]) //matchmaker za select
    const categories = Array.from(new Set(data.map(item => item.category))); //za dinamicki dropdown
    const categoryCounts = filteredData.reduce((acc, item) => {
        acc[decode(item.category)] = (acc[item.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>)
    const difficultyCounts = filteredData.reduce((acc, item) => {
        acc[item.difficulty] = (acc[item.difficulty] || 0) + 1;
        return acc;
    }, {} as Record<string, number>)

    //data za chart
    const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }))
    const difficultyData = Object.entries(difficultyCounts).map(([name, value]) => ({ name, value }))


    return (
<div className="container-fluid py-4 dashboard dashboard">
  
  <div className="dashboard__grid"></div>

  <header className="dashboard__header text-center mb-5">
    <p className="dashboard__title mb-3">Quiz Charts</p>
    <p className="dashboard__subtitle"># Number of categories:</p>
    <p className="dashboard__count">{categories.length}</p>
  </header>

  <section className="dashboard__filters row justify-content-center g-4 mb-5 mx-0">
    <div className="col-md-4">
      <div className="dashboard__filter">
        <label htmlFor="categorySelect" className="dashboard__label">
          Filter by Category
        </label>
        <select
          id="categorySelect"
          className="dashboard__select"
          value={selectedCategory ?? ""}
          onChange={(e: any) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{decode(cat)}</option>
          ))}
        </select>
      </div>
    </div>

    <div className="col-md-4">
      <div className="dashboard__filter">
        <label htmlFor="difficultySelect" className="dashboard__label">
          Filter by Difficulty
        </label>
        <select
          id="difficultySelect"
          className="dashboard__select"
          value={selectedDifficulty ?? ""}
          onChange={(e: any) => setSelectedDifficulty(e.target.value)}
        >
          <option value="">Any Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
    </div>

    <div className="col-md-4">
      <div className="dashboard__filter">
        <label htmlFor="chartSelect" className="dashboard__label">
          Chart Type
        </label>
        <select
          id="chartSelect"
          className="dashboard__select"
          value={selectedChart ?? ""}
          onChange={(e: any) => setSelectedChart(e.target.value)}
        >
          <option value="pie">Pie</option>
          <option value="bar">Bar</option>
        </select>
      </div>
    </div>
  </section>

  <section className="dashboard__charts">
    <div className="dashboard__chart">
      <h5 className="dashboard__chart-title">Questions by Category</h5>
      <Charts data={categoryData} chartType={selectedChart} />
    </div>

    <div id="chart_difficulty" className="dashboard__chart">
      <h5 className="dashboard__chart-title">Questions by Difficulty</h5>
      <Charts data={difficultyData} chartType={selectedChart} />
    </div>
  </section>
</div>


    )
}