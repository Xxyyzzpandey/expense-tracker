export default function SpendingInsights({ data }: { data: any[] }) {
    const overspending = data.filter((d) => d.spent > d.budget);
  
    return (
      <div>
        <h2>Spending Insights</h2>
        {overspending.length > 0 ? (
          <ul>
            {overspending.map((item) => (
              <li key={item.category} className="text-red-500">
                Over budget in {item.category}: Spent ${item.spent} (Budget: ${item.budget})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-green-500">You're within budget for all categories!</p>
        )}
      </div>
    );
  }
  