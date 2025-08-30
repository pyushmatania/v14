#!/bin/bash

# 🧹 Code Quality Maintenance Script
# This script runs all code quality checks and provides a summary

set -e

echo "🧹 Running Code Quality Checks..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    
    if [ "$status" = "PASS" ]; then
        echo -e "${GREEN}✅ $message${NC}"
    elif [ "$status" = "FAIL" ]; then
        echo -e "${RED}❌ $message${NC}"
    elif [ "$status" = "WARN" ]; then
        echo -e "${YELLOW}⚠️  $message${NC}"
    else
        echo -e "${BLUE}ℹ️  $message${NC}"
    fi
}

# Initialize counters
total_checks=0
passed_checks=0
failed_checks=0
warnings=0

# 1. TypeScript Type Checking
echo -e "\n${BLUE}📝 TypeScript Type Checking...${NC}"
if npm run typecheck > /dev/null 2>&1; then
    print_status "PASS" "TypeScript types are valid"
    ((passed_checks++))
else
    print_status "FAIL" "TypeScript type errors found"
    ((failed_checks++))
fi
((total_checks++))

# 2. ESLint Linting
echo -e "\n${BLUE}🧹 ESLint Linting...${NC}"
lint_output=$(npm run lint 2>&1 || true)
if echo "$lint_output" | grep -q "problems"; then
    problem_count=$(echo "$lint_output" | grep -o "[0-9]* problems" | head -1 | grep -o "[0-9]*")
    print_status "WARN" "ESLint found $problem_count issues"
    ((warnings++))
else
    print_status "PASS" "ESLint passed"
    ((passed_checks++))
fi
((total_checks++))

# 3. Build Verification
echo -e "\n${BLUE}🔨 Build Verification...${NC}"
if npm run build > /dev/null 2>&1; then
    print_status "PASS" "Build successful"
    ((passed_checks++))
else
    print_status "FAIL" "Build failed"
    ((failed_checks++))
fi
((total_checks++))

# 4. Unused Dependencies Check
echo -e "\n${BLUE}📦 Unused Dependencies...${NC}"
if npx depcheck --quiet > /dev/null 2>&1; then
    print_status "PASS" "No unused dependencies"
    ((passed_checks++))
else
    print_status "WARN" "Unused dependencies found (run 'npx depcheck' for details)"
    ((warnings++))
fi
((total_checks++))

# 5. Unused Exports Check
echo -e "\n${BLUE}🔍 Unused Exports...${NC}"
unused_exports=$(npx ts-prune 2>/dev/null | wc -l)
if [ "$unused_exports" -eq 0 ]; then
    print_status "PASS" "No unused exports"
    ((passed_checks++))
else
    print_status "WARN" "Found $unused_exports unused exports (run 'npx ts-prune' for details)"
    ((warnings++))
fi
((total_checks++))

# 6. Unused Files Check
echo -e "\n${BLUE}📁 Unused Files...${NC}"
if npx knip --reporter=json > knip-report.json 2>/dev/null; then
    unused_files=$(cat knip-report.json | grep -o '"unusedFiles":\[[^]]*\]' | grep -o '\[.*\]' | jq 'length' 2>/dev/null || echo "0")
    if [ "$unused_files" -eq 0 ]; then
        print_status "PASS" "No unused files"
        ((passed_checks++))
    else
        print_status "WARN" "Found $unused_files unused files (run 'npx knip' for details)"
        ((warnings++))
    fi
else
    print_status "WARN" "Could not check for unused files"
    ((warnings++))
fi
((total_checks++))

# 7. Bundle Size Check
echo -e "\n${BLUE}📊 Bundle Size Analysis...${NC}"
if [ -f "dist/index.html" ]; then
    bundle_size=$(du -sh dist/ | cut -f1)
    print_status "INFO" "Bundle size: $bundle_size"
    ((passed_checks++))
else
    print_status "WARN" "No build artifacts found"
    ((warnings++))
fi
((total_checks++))

# Clean up temporary files
rm -f knip-report.json

# Summary
echo -e "\n${BLUE}=================================="
echo "📊 CODE QUALITY SUMMARY"
echo "==================================${NC}"

echo -e "Total Checks: ${BLUE}$total_checks${NC}"
echo -e "Passed: ${GREEN}$passed_checks${NC}"
echo -e "Failed: ${RED}$failed_checks${NC}"
echo -e "Warnings: ${YELLOW}$warnings${NC}"

# Calculate percentage
if [ $total_checks -gt 0 ]; then
    pass_percentage=$((passed_checks * 100 / total_checks))
    echo -e "\nSuccess Rate: ${BLUE}${pass_percentage}%${NC}"
fi

# Recommendations
echo -e "\n${BLUE}💡 RECOMMENDATIONS:${NC}"

if [ $failed_checks -gt 0 ]; then
    echo -e "${RED}• Fix TypeScript and build errors first${NC}"
fi

if [ $warnings -gt 0 ]; then
    echo -e "${YELLOW}• Address ESLint issues for better code quality${NC}"
    echo -e "${YELLOW}• Review unused dependencies and exports${NC}"
    echo -e "${YELLOW}• Consider removing unused files${NC}"
fi

if [ $failed_checks -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}• Excellent! Code quality is high${NC}"
    echo -e "${GREEN}• Keep up the good work!${NC}"
fi

# Exit with appropriate code
if [ $failed_checks -gt 0 ]; then
    exit 1
elif [ $warnings -gt 0 ]; then
    exit 0
else
    exit 0
fi
