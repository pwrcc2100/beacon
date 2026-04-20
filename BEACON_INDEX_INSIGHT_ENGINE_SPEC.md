# Beacon Index Insight Engine & Risk Propagation Model

## Design Objective

Beacon Index should move beyond descriptive dashboards. Instead of displaying `score → chart`, the system should produce `score → interpretation → leadership action`. This positions Beacon Index as a psychosocial risk governance intelligence system rather than a survey tool.

## Domain Inputs

Beacon Index measures five structural domains:

- **Experience** (Overall Sentiment)
- **Workload & Resourcing**
- **Psychological Safety**
- **Leadership & Support**
- **Clarity & Direction**

Each domain produces a 0–100 score.

### Composite Score Bands

- **80–100** = Low Exposure
- **70–79** = Within Tolerance
- **60–69** = Emerging Strain
- **40–59** = Elevated Risk
- **0–39** = Critical Risk

## Domain Interpretation Logic

### Experience

**Rule E1: IF Experience < 40**

- **System Signal**: Workforce strain is critically elevated.
- **Structural Implication**: Sustained strain is associated with burnout risk, withdrawal behaviours, and declining psychological safety.
- **Leadership Focus**: Identify the most significant operational pressure points affecting teams and reduce structural workload or coordination pressure.

**Rule E2: IF Experience between 40 and 59**

- **System Signal**: System strain is emerging.
- **Structural Implication**: Sustained pressure may begin to reduce psychological safety and discretionary effort.
- **Leadership Focus**: Identify early operational pressures and intervene before escalation.

### Workload & Resourcing

**Rule W1: IF Workload & Resourcing < 50**

- **System Signal**: Operational demand may be exceeding available capacity.
- **Structural Implication**: Demand-capacity imbalance typically leads to fatigue accumulation, error risk and declining experience scores.
- **Leadership Focus**: Rebalance workload and available resources by removing non-essential tasks or adjusting timelines.

### Psychological Safety

**Rule P1: IF Psychological Safety < 60**

- **System Signal**: Interpersonal risk climate is deteriorating.
- **Structural Implication**: Low psychological safety reduces early problem detection and increases escalation risk.
- **Leadership Focus**: Leaders should reinforce open communication signals and reward early issue escalation.

### Leadership & Support

**Rule L1: IF Leadership & Support < 60**

- **System Signal**: Leadership support capacity may be insufficient for current operating pressure.
- **Structural Implication**: Low support amplifies workload stress and reduces psychological safety.
- **Leadership Focus**: Increase leadership visibility, decision clarity and support availability.

### Clarity & Direction

**Rule C1: IF Clarity & Direction < 60**

- **System Signal**: Role clarity or organisational alignment may be weakening.
- **Structural Implication**: Low clarity creates duplicated work, decision delays and hidden workload pressure.
- **Leadership Focus**: Clarify priorities, decision ownership and organisational direction.

## Psychosocial Risk Propagation Model

Psychosocial risk does not occur independently across domains. Pressure typically spreads through structural pathways. The system should detect these propagation patterns.

### Propagation Pathway 1: Workload → Experience

**Mechanism**: Operational overload reduces workforce recovery capacity.

```
Workload imbalance
↓
Sustained operational pressure
↓
Declining Experience
↓
Burnout risk
```

**Rule**: IF Workload & Resourcing < 55 AND Experience < 50

**Insight**: Operational demand may be exceeding workforce capacity and driving declining experience.

### Propagation Pathway 2: Clarity → Workload

**Mechanism**: Poor organisational clarity creates hidden workload pressure.

```
Low Clarity
↓
Coordination friction
↓
Hidden workload
↓
Experience decline
```

**Rule**: IF Clarity & Direction < 60 AND Workload & Resourcing < 60

**Insight**: Coordination misalignment may be generating unnecessary workload pressure.

### Propagation Pathway 3: Leadership → Psychological Safety

**Mechanism**: Leadership conditions strongly influence interpersonal safety.

```
Low leadership support
↓
Reduced trust
↓
Psychological safety decline
```

**Rule**: IF Leadership & Support < 60 AND Psychological Safety < 65

**Insight**: Leadership support conditions may be affecting the interpersonal safety climate.

### Propagation Pathway 4: Experience → Psychological Safety

**Mechanism**: Sustained pressure suppresses open communication.

```
Low Experience
↓
Stress accumulation
↓
Reduced openness
↓
Psychological safety decline
```

**Rule**: IF Experience < 50 AND Psychological Safety < 60

**Insight**: Workforce pressure may be suppressing open communication.

## Trend Escalation Detection

Detect persistent deterioration patterns.

**Rule**: IF any domain declines for 3 or more consecutive reporting cycles

**Insight**: Structural pressure is intensifying and may escalate if not addressed.

## Primary Pressure Source Algorithm

The system should identify which domain is most likely driving system deterioration.

### Algorithm Logic

1. Identify the lowest domain score below 60.
2. Evaluate propagation relationships.
3. Determine which upstream domain logically explains downstream deterioration.

### Example Logic

- IF Clarity < Workload AND Workload < Experience
  - **Primary Pressure Source** = Clarity & Direction
  - **Propagation Risk** = Workload & Resourcing → Experience

- IF Workload < Experience AND Experience < Psychological Safety
  - **Primary Pressure Source** = Workload & Resourcing
  - **Propagation Risk** = Experience → Psychological Safety

- IF Leadership < Psychological Safety
  - **Primary Pressure Source** = Leadership & Support
  - **Propagation Risk** = Leadership & Support → Psychological Safety

- IF Experience < Psychological Safety
  - **Primary Pressure Source** = Experience
  - **Propagation Risk** = Experience → Psychological Safety

### Full System Interaction Map

The domains interact roughly like this:

```
Clarity & Direction
        ↓
Workload & Resourcing
        ↓
     Experience
        ↓
Psychological Safety
        ↑
Leadership & Support
```

**Leadership acts as a buffer variable**: Strong leadership can prevent pressure propagation. Weak leadership accelerates it.

## Insight Output Structure

Each generated insight must follow this format:

### Primary Signal
Short interpretation of the overall system condition.

### Structural Implication
Explanation of how the condition affects organisational functioning.

### Leadership Focus
Practical leadership actions to stabilise conditions.

### Example Output

**Primary Signal**: Workforce strain is critically elevated.

**Structural Implication**: Sustained pressure across teams is associated with declining psychological safety and increased burnout risk.

**Leadership Focus**: Identify and relieve the most significant operational pressure points affecting teams.

## Example: Full System Insight

Imagine the following scores:

| Domain | Score |
|--------|-------|
| Experience | 33 |
| Workload | 64 |
| Psychological Safety | 52 |
| Leadership | 55 |
| Clarity | 45 |

**Generated Insight**:

**Primary System Signal**: Workforce strain is critically elevated. Experience has fallen to 33 indicating sustained structural pressure across teams.

**Pressure Source**: Low organisational clarity may be contributing to coordination friction and hidden workload.

**System Propagation**: Under sustained pressure environments, psychological safety often declines as individuals become less likely to raise concerns. Current scores suggest this pattern may already be emerging.

**Leadership Focus**: Leaders should prioritise:
- clarifying priorities and decision ownership
- relieving operational pressure points
- reinforcing open communication signals.

## What This Enables

Instead of saying: *"Psychological safety is low"*

Beacon Index can say: *"Psychological safety is declining likely due to sustained workforce pressure originating in coordination or workload conditions."*

This provides actionable intelligence for executives rather than descriptive data.

## Research Foundation

The propagation logic aligns with established organisational research including:

- **Job Demands–Resources Model** (Bakker & Demerouti)
- **Psychological Safety research** (Amy Edmondson)
- **Work design stress models** used in occupational psychology

These frameworks consistently show that work design pressures propagate through leadership behaviour and interpersonal climate.
