# 🎯 World-Class React Hooks - Complete Guide

## The Three Essential Hooks

---

## 1. useSyncExternalStore 📦

### What It Does
Connects React to data sources OUTSIDE React (localStorage, browser APIs, WebSockets, etc.)

### When To Use
- Persisting data to localStorage
- Reading browser state (online/offline, screen size, etc.)
- Subscribing to WebSockets or Server-Sent Events
- Integrating with non-React global state

### Pattern
```javascript
const data = useSyncExternalStore(
  subscribe,    // Function to subscribe to changes
  getSnapshot,  // Function to get current value
  () => []      // Server-side fallback
);
```

### Real Example (localStorage)
```javascript
const todoStore = {
  listeners: new Set(),
  todos: [],
  
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  },
  
  getSnapshot() {
    return this.todos;
  },
  
  updateTodos(newTodos) {
    this.todos = newTodos;
    localStorage.setItem('todos', JSON.stringify(newTodos));
    this.listeners.forEach(cb => cb()); // Notify React
  }
};

// In component:
const todos = useSyncExternalStore(
  todoStore.subscribe,
  todoStore.getSnapshot
);
```

### Key Points
✅ React automatically re-renders when external data changes
✅ Proper cleanup when component unmounts
✅ Server-safe (SSR compatible)
✅ Standard pattern used by Redux, Zustand, etc.

---

## 2. useOptimistic ⚡

### What It Does
Shows changes INSTANTLY before server confirms. If server fails, automatically rolls back.

### When To Use
- Adding items to a list
- Toggling states (like/favorite/complete)
- Updating text
- Deleting items
- Any mutation where you want instant feedback

### Pattern
```javascript
const [optimisticState, addOptimistic] = useOptimistic(
  actualState,
  (current, optimisticValue) => {
    // How to add optimistic value to current state
    return [...current, optimisticValue];
  }
);

// Usage:
addOptimistic(tempItem); // Shows instantly!
await api.save(item);     // Save in background
// If API fails, optimistic item auto-disappears
```

### Real Example (Add Todo)
```javascript
const [todos, setTodos] = useState([]);
const [optimisticTodos, addOptimistic] = useOptimistic(
  todos,
  (current, newTodo) => [...current, newTodo]
);

async function handleAdd(text) {
  const temp = { id: 'temp-123', text };
  
  addOptimistic(temp);          // UI updates instantly!
  
  const real = await api.add(); // API in background
  setTodos([...todos, real]);   // Replace temp with real
}
```

### Key Points
✅ App feels INSTANT (like Google Docs, Figma)
✅ Automatic rollback on errors
✅ No loading spinners blocking user
✅ Professional UX standard

---

## 3. useTransition 🔄

### What It Does
Keeps UI responsive during slow operations. Shows visual feedback but doesn't block interactions.

### When To Use
- API calls that take time
- Heavy computations
- Large list updates
- Route transitions
- Any operation where UI might freeze

### Pattern
```javascript
const [isPending, startTransition] = useTransition();

function handleSlowOperation() {
  startTransition(() => {
    // Slow operation here
    doSomethingSlow();
  });
  
  // Returns immediately!
  // isPending = true while operation runs
}

// In JSX:
{isPending && <Spinner />}
```

### Real Example (Toggle Todo)
```javascript
const [isPending, startTransition] = useTransition();

function handleToggle(id) {
  startTransition(() => {
    toggleTodo(id); // This takes 0.8s
  });
  
  // Function returns immediately!
  // User can keep clicking, scrolling, typing!
}

// UI shows feedback:
{isPending && (
  <span className="badge">Updating...</span>
)}
```

### Visual Comparison

**WITHOUT useTransition:**
```
User clicks → [FROZEN] → [FROZEN] → [FROZEN] → Updates
(User: "Is this broken?")
```

**WITH useTransition:**
```
User clicks → Badge appears instantly → User keeps working → Updates
(User: "Nice, smooth!")
```

### Key Points
✅ UI NEVER freezes
✅ Instant visual feedback (isPending)
✅ User can continue working
✅ Professional feel

---

## 🎨 How They Work Together

### Scenario: User adds a todo

```javascript
// Step 1: Setup hooks
const storedTodos = useSyncExternalStore(...);  // localStorage
const [optimisticTodos, addOptimistic] = useOptimistic(storedTodos, ...);
const [isPending, startTransition] = useTransition();

// Step 2: User adds todo
async function handleAdd(text) {
  const temp = { id: 'temp-123', text };
  
  startTransition(async () => {
    // useOptimistic: Show instantly
    addOptimistic(temp);
    
    // API call in background
    const real = await api.add(text);
    
    // useSyncExternalStore: Save to localStorage
    todoStore.updateTodos([...storedTodos, real]);
  });
}

// Result:
// ⚡ Todo appears instantly (useOptimistic)
// 🔄 Form stays responsive (useTransition)
// 📦 Data persists (useSyncExternalStore)
```

---

## 📊 Quick Reference Table

| Hook | Purpose | When | Visual Feedback |
|------|---------|------|-----------------|
| useSyncExternalStore | Connect external data | Always for localStorage, browser APIs | None (transparent) |
| useOptimistic | Instant updates | All mutations (add/edit/delete) | Orange "Optimistic" badge |
| useTransition | Smooth UI | Slow operations | Blue "Processing" badge + isPending |

---

## ✅ Best Practices

### useSyncExternalStore
```javascript
✅ DO: Keep store simple, focused
✅ DO: Provide proper cleanup in subscribe
✅ DO: Handle localStorage errors gracefully
❌ DON'T: Put React state in external store
❌ DON'T: Forget server-side fallback
```

### useOptimistic
```javascript
✅ DO: Use for ALL mutations
✅ DO: Create unique temp IDs (temp-timestamp)
✅ DO: Let it auto-rollback on errors
❌ DON'T: Manually manage optimistic state
❌ DON'T: Skip optimistic updates for "fast" APIs
```

### useTransition
```javascript
✅ DO: Wrap ALL async operations
✅ DO: Show isPending feedback
✅ DO: Test by trying other actions during transition
❌ DON'T: Use for instant operations
❌ DON'T: Forget to disable buttons during isPending
```

---

## 🌟 Real-World Examples

### Google Docs
- Type → Text appears instantly (useOptimistic)
- Saves in background (useTransition)
- Persists across sessions (useSyncExternalStore)

### Figma
- Move object → Updates instantly (useOptimistic)
- Syncs with team (useTransition)
- Stays in sync (useSyncExternalStore)

### Linear
- Create issue → Appears instantly (useOptimistic)
- Assigns ID in background (useTransition)
- Updates cache (useSyncExternalStore)

---

## 💡 The Key Insight

These three hooks are THE STANDARD for building modern, professional web apps.

**Amateur apps:** Wait → Loading spinner → Update
**Professional apps:** Update instantly → Process in background → Stay responsive

The difference is user perception:
- Amateur: "This is slow"
- Professional: "This is smooth!"

---

## 🚀 Next Steps

1. Study the code in this todo app
2. Notice how all three hooks work together
3. Try adding/toggling todos and watch:
   - Orange badges (useOptimistic)
   - Blue badges (useTransition)  
   - Data persisting (useSyncExternalStore)
4. Practice implementing these patterns in your own apps

**Remember:** These aren't "advanced" features. They're industry standard. Master them!